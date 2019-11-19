# project overview

anpoorte a supporting piece of a larger application [wjisk](https://github.com/kevinforrestkeyes/wjisk) - for taking product data that has been uploaded to [Depop](https://www.depop.com/) and transferring it to a store on [Shopify](https://shopify.com/). it can be tedious to try to maintain parity between the two platforms as there are no existing tools for moving data between them. i wanted to create a simple application to bridge the gap between these platforms and allow the user some control over how the products were being processed as they move from Depop to Shopify. this repository is only the part of this application, and is used to support other applications that i built specifically to facilitate this process. 

## this repository

anpoorte is a node/express server which interacts with the Shopify API and also has an its own API for handling requests from the front-end of the application. it uses a mongo database to store product data from Shopify, which it serves via the API to the client. it also accepts payloads of product data from the client to upload to Shopify. essentially working as a pass-between from wjisk to the desired Shopify store, while also leveraging a database for caching some of the product data for the user.

## supporting applications

* [wjisk](https://github.com/kevinforrestkeyes/wjisk)
* [popwizard](https://github.com/kevinforrestkeyes/popwizard)
