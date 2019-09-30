import { getAllProducts, addNewProduct } from './lib/shopify';

const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('anpoorte birb')
});

app.get('/get-shopify-products', function (req, res) {
	const logIndex = newLog('get-shopify-products');
	getAllProducts()
		.then((products) => res.send(products))
		.catch((err) => console.error(err));
	endLog(logIndex);
});

app.get('/add-shopify-product', function (req, res) {
	addNewProduct()
		.then((product) => res.send(product))
		.catch((err) => console.error(err));
});

const PORT = process.env.PORT || 2222;
app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});