// Import the modules from package
import { Router } from 'express';
import axios from 'axios';
const router = Router();
import Product from '../Models/product.model.js';
import { productSchema } from '../helpers/validation_schema.js';
import { Header, Response } from '../Models/response.model.js';



//Create Product
router.post('/new', async (req, res, next) => {
    try {
        const cat = await productSchema.validateAsync(req.body);
        console.log(cat);
        const product = Product({
            name: cat.name,
            price: cat.price,
            picture: cat.picture,
            storeID: cat.storeID,
            categoryID: cat.categoryID,
            description: cat.description,
            status: 'ACTIVE',
        });
        await product.save();
        // make a post request via axios to add a product document
        const body = {
            name: product.name,
            price: product.price,
            picture: product.picture,
            storeID: product.storeID,
            categoryID: product.categoryID,
            description: product.description,
            bids: product.bids,
            status: product.status,
        };
        await axios.post(`http://localhost:9200/retrovegas/product/${product._id}`, body)
            .then((response) => {
                console.log(`Product: ${product._id} Added successfully`);
            })
            .catch((error) => {
                console.log(error);
                console.log(`Product: ${product._id} Encountered isues while adding`);
            });

        res.status(200).json(
            Response(Header(0, null, null), {
                message: "Product created!"
            })
        );
    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if (error.isJoi === true) error.status = 422;
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

// Get all Product
router.get('/all', async (req, res, next) => {
    try {
        const list = await Product.find();
        res.send(Response(Header(0, null, null), { products: list }));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

// Migrate all products to the Elasticsearch cluster
router.get('/migrate', async (req, res, next) => {
    try {
        const list = await Product.find();
        const reply = [];
        list.forEach(async (product) => {
            const body = {
                name: product.name,
                price: product.price,
                picture: product.picture,
                storeID: product.storeID,
                categoryID: product.categoryID,
                description: product.description,
                bids: product.bids,
                status: product.status,
            };
            // make a post request via axios to add a product document
            await axios.post(`http://localhost:9200/retrovegas/product/${product._id}`, body)
                .then((response) => {
                    console.log(`Product: ${product._id} Added successfully`);
                    reply.push(`Product: ${product._id} Added successfully`);
                })
                .catch((error) => {
                    console.log(`Product: ${product._id} Encountered isues while adding`);
                    reply.push(`Product: ${product._id} Encountered isues while adding`);
                });
        });
        const msg = {
            message: "Products migrated to Elasticsearch!",
            product_count: list.length,
            status: "success!",
            reply: reply
        };
        res.send(Response(Header(0, null, null), msg));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

// Remove all products from the Elasticsearch cluster
router.delete('/undo_migrate', async (req, res, next) => {
    try {
        const list = await Product.find();
        const reply = [];
        list.forEach(async (product) => {
            // make a delete request via axios to remove a product document
            // DELETE /<index>/_doc/<_id>
            await axios.delete(`http://localhost:9200/retrovegas/product/${product._id}`)
                .then((response) => {
                    console.log(`Product: ${product._id} Deleted successfully`);
                    reply.push(`Product: ${product._id} Deleted successfully`);
                })
                .catch((error) => {
                    console.log(`Product: ${product._id} Encountered isues while deleting`);
                    reply.push(`Product: ${product._id} Encountered isues while deleting`);
                });
        });
        const msg = {
            message: "Products Deleted from Elasticsearch!",
            product_count: list.length,
            status: reply
        };
        res.send(Response(Header(0, null, null), msg));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});
//Read Product by id
router.get('/:id', async (req, res, next) => {
    Product.findById(req.params.id)
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), { product: doc })
                );
            } else {
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided product"),)
                )
            }
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//read product by name
router.post('/search', async (req, res, next) => {
    const regex = new RegExp(req.body.query, 'i') // i for case insensitive
    Product.find({ name: { $regex: regex } }).limit(3).skip(req.body.offset)
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), { product: doc })
                );
            } else {
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided product"),)
                )
            }
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//Read Product by category id
router.get('/cat/:id', async (req, res, next) => {
    Product.find({ categoryID: req.params.id })
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), { product: doc })
                );
            } else {
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided category"),)
                )
            }
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//read products of categories
router.post('/category/:id', async (req, res, next) => {
    Product.find({ categoryID: req.params.id }).limit(3).skip(req.body.offset)
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), { product: doc })
                );
            } else {
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided product"),)
                )
            }
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//Update product
router.put('/update/:id', async (req, res, next) => {
    const result = req.body;
    Product.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            name: result.name,
            price: result.price,
            picture: result.picture,
            storeID: result.storeID,
            categoryID: result.categoryID,
            description: result.description,
        }
    })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                product: result
            }));
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//delete Product
router.delete('/delete/:id', async (req, res, next) => {

    Product.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(async result => {
            await axios.delete(`http://localhost:9200/retrovegas/product/${req.params.id}`)
            .then((response) => {
                console.log(`Product: ${req.params.id} Deleted successfully`);
            })
            .catch((error) => {
                console.log(`Product: ${req.params.id} Encountered isues while deleting`);
            });

            res.status(200).json(Response(Header(0, null, null), {
                message: "Product deleted."
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );

        });
});




export default router;