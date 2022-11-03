// Import the modules from package
import { Router } from 'express';
const router = Router();
import Order from '../Models/order.model.js';
import { verifyAccessToken } from '../helpers/jwt_helper.js';
import {orderSchema} from '../helpers/validation_schema.js';
import {Header, Response} from '../Models/response.model.js';

// Get all orders
router.get('/all', async(req, res, next) => {
    try {
        const list = await Order.find();
        res.send(Response(Header(0, null, null), {orders: list}));
    } catch (error) {
        res.status(200).json(
            Response(Header(1, error.status, error.message))
        );
    }
});

//Create order
router.post('/', async(req, res, next) => {
    try {

        const valid = await orderSchema.validateAsync(req.body);

        const order = Order({
            customerID: valid.customerID,
            total_amount: valid.total_amount,
            address: valid.address,
            order_date_time: valid.order_date_time,
            delivery_date_time: valid.delivery_date_time,
            status: valid.status,
        });
        
        await order.save();
        
        res.status(200).json(
            Response(Header(0, null, null), {
                message: "Order created!"
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


//Read order by id
router.get('/:id', verifyAccessToken, async(req, res, next) => {
        Order.findById(req.params.id)
            .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null), {order: doc,})
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

//Update order
router.put('/:id', verifyAccessToken, async(req, res, next)=>{
    
    const valid = await orderSchema.validateAsync(req.body);
        Order.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                customerID: valid.customerID,
                total_amount: valid.total_amount,
                address: valid.address,
                order_date_time: valid.order_date_time,
                delivery_date_time: valid.delivery_date_time,
                status: valid.status,
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

    Order.findOneAndUpdate({_id: req.params.id }, {
        $set: {
            status: "Cancelled"
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