import Shopify from 'shopify-api-node';

export async function getAllProducts(shopName, accessToken) {
	console.log('hitting');
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
	const { title, blurb, price, tags } = product;
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

	shopify.product
		.create({
			title,
			published: false,
			body_html: blurb,
			images,
			tags,
			variants: [
				{
					price,
				}
			]
		})
		.then(
			(product) => console.log(product), 
			(err) => console.log(err)
		);
}