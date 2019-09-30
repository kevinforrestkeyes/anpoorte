import Shopify from 'shopify-api-node';
import product from '../models/product';
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
	const product = await shopify.product
		.create({
			title: "TEST TITLE",
			body_html: "<p>TEST BODY</p>",
			vendor: "poorbaby_fashion",
			handle: "TEST HANDLE",
			tags: "TAG1, TAG2",
			variants: [
				{
					title: "5",
					price: "15.00",
					position: 1,
					option1: "5",
				}
			],
		})
		.then((product) => console.log(product));
	return product;
}