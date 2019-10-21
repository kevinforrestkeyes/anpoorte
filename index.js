import { addNewProduct, getAllProducts } from './lib/shopify';
import { createTokenEntry, addTokenToTokenEntry, findTokenEntryByClientToken } from './lib/db_controller';

const dotenv = require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const cookie = require('cookie');
const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const app = express();
const Shopify = require('shopify-api-node');

const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const forwardingAddress = process.env.FORWARDING_ADDRESS;
const scopes = 'read_products,write_products';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send({ respone: 'anpoort birb' });
});

app.post('/add-new-product', async (req, res) => {
	const clientToken = req.query.clientToken;
	const tokenEntry = await findTokenEntryByClientToken(clientToken);
	if (tokenEntry) {
		const accessToken = tokenEntry.storeToken;
		const shopName = tokenEntry.storeName;
		addNewProduct(shopName, accessToken, req.body)
			.then((result) => res.send(result))
	} else {
		res.send({ 
			status: 'failure',
			message: 'no matching token found'
		});
	}
})

app.get('/shopify', (req, res) => {
  const shop = req.query.shop;
  if (shop) {
    const state = nonce();
		const redirectUri = forwardingAddress + '/auth/callback';
    const installUrl = 'https://' + shop +
      '/admin/oauth/authorize?client_id=' + apiKey +
      '&scope=' + scopes +
      '&state=' + state +
      '&redirect_uri=' + redirectUri;

    res.cookie('state', state);
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
  }
});

app.get('/auth/callback', async (req, res) => {
	const { shop, hmac, code, state } = req.query;
	createTokenEntry(shop);
  const stateCookie = cookie.parse(req.headers.cookie).state;

  if (state !== stateCookie) {
    return res.status(403).send('Request origin cannot be verified');
  }

  if (shop && hmac && code) {
    const map = Object.assign({}, req.query);
		delete map['signature'];
		delete map['hmac'];
		const message = querystring.stringify(map);
		const providedHmac = Buffer.from(hmac, 'utf-8');
		const generatedHash = Buffer.from(
			crypto
				.createHmac('sha256', apiSecret)
				.update(message)
				.digest('hex'),
				'utf-8'
			);
		let hashEquals = false;
		try {
			hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
		} catch (e) {
			hashEquals = false;
		};

		if (!hashEquals) {
			return res.status(400).send('HMAC validation failed');
		}

		const accessTokenRequestUrl = 'https://' + shop + '/admin/oauth/access_token';
		const accessTokenPayload = {
			client_id: apiKey,
			client_secret: apiSecret,
			code,
		};

		request.post(accessTokenRequestUrl, { json: accessTokenPayload })
		.then(async (accessTokenResponse) => {
			const accessToken = accessTokenResponse.access_token;
			const { clientToken } = await addTokenToTokenEntry(shop, accessToken);
			res.redirect(`http://localhost:8081/shopify?shopifyClientToken=${clientToken}`);
		})
		.catch((error) => {
			res.status(error.statusCode).send(error.error.error_description);
		});
  } else {
    res.status(400).send('Required parameters missing');
  }
});

app.get('/get-products', async (req, res) => {
	const clientToken = req.query.clientToken;
	const tokenEntry = await findTokenEntryByClientToken(clientToken);
	if (tokenEntry) {
		const accessToken = tokenEntry.storeToken;
		const shopName = tokenEntry.storeName;
		getAllProducts(shopName, accessToken)
			.then((products) => res.send({
				status: 'success',
				products
			}));
	} else {
		res.send({ 
			status: 'failure',
			message: 'no matching token found'
		});
	}
})

const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log('birb on 4444');
});