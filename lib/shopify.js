import Shopify from 'shopify-api-node';

export async function getAllProducts(shopName, accessToken) {
	const shopify = new Shopify({
		shopName,
		accessToken,
	});

	const products = await shopify.product
		.list()
		.then((products) => products);
	return products;
}

export async function addNewProduct(shopName, accessToken) {
	const shopify = new Shopify({
		shopName,
		accessToken,
	});

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