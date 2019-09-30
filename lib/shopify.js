import Shopify from 'shopify-api-node';
const dotenv = require('dotenv').config();

const shopName = process.env.SHOP_NAME;
const apiKey = process.env.API_KEY;
const password = process.env.PASSWORD;

const shopify = new Shopify({
  shopName,
  apiKey,
  password
});

export async function getAllProducts() {
	const products = await shopify.product
		.list()
		.then((products) => products);
	return products;
}

export async function addNewProduct() {
	shopify.product
		.create({
			"title": "crappy pet store nuggets",
			"body_html": "<strong>CRAPS!</strong>",
			"vendor": "jimym",
			"product_type": "Snowboard",
			"tags": "Barnes & Noble, John's Fav, \"Big Air\""
		})
		.then(
			(product) => product, 
			(err) => console.log(err)
		);
}