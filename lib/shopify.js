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

export async function addNewProduct(shopName, accessToken, product) {
	const { title, description, price, tags } = product;
	const images = product.images.map((src, index) => {
		return {
			position: (index+1),
			src
		}
	});

	const shopify = new Shopify({
		shopName,
		accessToken,
	});

	const result = await shopify.product
		.create({
			title,
			published: false,
			body_html: description,
			images,
			tags,
			variants: [
				{
					price,
				}
			]
		})
		.then((product) => { result: 'success' })
		.catch((err) => { result: 'error', err });
	return result;
}