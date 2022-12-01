// Import the modules from package
import { Router } from 'express';
const router = Router();
import Customer from '../Models/customer.model.js';
import { verifyAccessToken } from '../helpers/jwt_helper.js';
import { customerSchema } from '../helpers/validation_schema.js';
import { Header, Response } from '../Models/response.model.js';

// Get all customers
router.get('/all', async (req, res, next) => {
    try {
        const cust_list = await Customer.find();
        res.send(Response(Header(0, null, null), { customers: cust_list }));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

//Create Customer
router.post('/', async (req, res, next) => {
    try {

        const valid = await customerSchema.validateAsync(req.body);

        const customer = Customer({
            userID: valid.userID,
            cart: valid.cart,
            favs: valid.favs,
            orders: valid.orders,
        });

        await customer.save();
        res.status(200).json(
            Response(Header(0, null, null), {
                message: "Customer created!"
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


//Read customer by id
router.get('/:id', verifyAccessToken, async (req, res, next) => {
    Customer.findById(req.params.id)
        .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), { customer: doc, })
                );
            } else {
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided ID"),)
                )
            }
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//Update Customer
router.put('/:id', verifyAccessToken, async (req, res, next) => {

    const result = await customerSchema.validateAsync(req.body);
    Customer.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            userID: result.userID,
            cart: result.cart,
            favs: result.favs,
            orders: result.orders,
        }
    })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                customer: result
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//delete customer
router.delete('/:id', verifyAccessToken, async (req, res, next) => {

    User.findOneAndUpdate({ customer_ID: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                message: "User deleted."
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );

        });
});

// Add a productId to the customers cart
router.get('/addtocart/:id', verifyAccessToken, async (req, res, next) => {
    // Get User from Access Token
    const userID = req.payload.aud;
    // Get Product ID from URL
    const productID = req.params.id;
    // Find the customer by userID
    Customer.findOne({ userID: userID })
        .then(doc => {
            if (doc) {
                // Add the productID to the cart
                doc.cart.push(productID);
                // Save the customer
                doc.save()
                    .then(result => {
                        // Success to save response
                        res.status(200).json(
                            Response(Header(0, null, null), { customer: result, })
                        );
                    })
                    .catch(err => {
                        // Error to save response
                        res.status(200).json(
                            Response(Header(1, err.status, err.message))
                        );
                    });
            } else {
                // No customer found response
                res.status(200).json(
                    Response(Header(0, 404, "No entry found for provided ID"),)
                )
            }
        })
        .catch(err => {
            // Error to find customer response
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});




export default router;