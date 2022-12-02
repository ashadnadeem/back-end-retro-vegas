// Import the modules from package
import { Router } from 'express';
const router = Router();
import Product from '../Models/product.model.js';
import { productSchema } from '../helpers/validation_schema.js';
import { Header, Response } from '../Models/response.model.js';



//Create Product
router.post('/new', async (req, res, next) => {
    try {
        const cat = await productSchema.validateAsync(req.body);
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
    Product.find({ name: { $regex: regex } })
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
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                message: "Product deleted."
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );

        });
})



export default router;