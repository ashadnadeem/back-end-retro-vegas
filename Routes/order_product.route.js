// Import the modules from package
import { Router } from 'express';
const router = Router();
import OrderProduct from '../Models/order_product.model';
import { verifyAccessToken } from '../helpers/jwt_helper.js';
import {orderProductSchema} from '../helpers/validation_schema.js';
import {Header, Response} from '../Models/response.model.js';

// Get all order products
router.get('/all', async(req, res, next) => {
    try {
        const list = await OrderProduct.find();
        res.send(Response(Header(0, null, null), {orders: list}));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

//Create order product
router.post('/', async(req, res, next) => {
    try {

        const valid = await orderProductSchema.validateAsync(req.body);

        const order_product = OrderProduct({
            productID: valid.productID,
            orderID: valid.orderID,
            discount: valid.discount,
            quantity: valid.quantity,
            status: "Active"
        });
        
        await order_product.save();
        
        res.status(200).json(
            Response(Header(0, null, null), {
                message: "Order product created!"
            })
        );
        

    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if(error.isJoi === true) error.status = 422;
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});


//Read order product by id
router.get('/:id', verifyAccessToken, async(req, res, next) => {
        OrderProduct.findById(req.params.id)
            .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), {order_product: doc,})
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

//Update order product
router.put('/:id', verifyAccessToken, async(req, res, next)=>{
    
    const valid = await orderProductSchema.validateAsync(req.body);
        OrderProduct.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                productID: valid.productID,
                orderID: valid.orderID,
                discount: valid.discount,
                quantity: valid.quantity,
            }
        })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                order: result
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );
        });
});

//delete order
router.delete('/:id', verifyAccessToken, async (req, res, next) => {

    OrderProduct.findOneAndUpdate({_id: req.params.id }, {
        $set: {
            status: "Deleted"
        }
    })
        .then(result => {
            res.status(200).json(Response(Header(0, null, null), {
                order: result
            }))
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, err.status, err.message))
            );

        });
})


export default router;