// Import the modules from package
import { Router } from 'express';
const router = Router();
import Store from '../Models/store.model.js';
import { verifyAccessToken } from '../helpers/jwt_helper.js';
import {storeSchema} from '../helpers/validation_schema.js'

// Get all stores
router.get('/all', async(req, res, next) => {
    try {
        const store_list = await Store.find();
        res.send({Stores: store_list});
    } catch (error) {
        next(error);
    }
});

//Create Store
router.post('/', async(req, res, next) => {
    try {
        const valid = await storeSchema.validateAsync(req.body);

        const store = Store({
            userID: valid.userID,
            products: valid.products,
            name: valid.name,
            rating: valid.rating,
            trustedSeller: valid.trustedSeller,
            orders: valid.orders,
        });
        const savedStore = await store.save();

        res.status(200).json({
            message: "Store created!"
        }) 

    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if(error.isJoi === true) error.status = 422;
        next(error);
    }
});


//Read store by id
router.get('/:id', verifyAccessToken, async(req, res, next) => {
        Store.findById(req.params.id)
            .then(doc => {
            if (doc) {
                res.status(200).json({
                    store: doc,
                });
            } else {
                res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
            }
            })
            .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
            });
});

//Update store
router.put('/:id', verifyAccessToken, async(req, res, next)=>{
    
    const result = await storeSchema.validateAsync(req.body);
        Store.findOneAndUpdate({ _id: req.params.id }, {
            $set: {
                userID: valid.userID,
                products: valid.products,
                name: valid.name,
                rating: valid.rating,
                trustedSeller: valid.trustedSeller,
                orders: valid.orders,
            }
        })
            .then(result => {
                res.status(200).json({
                customer: result
                })
        })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
});

// //delete User
// router.delete('/:id', verifyAccessToken, async (req, res, next) => {

//     User.findOneAndUpdate({customer_ID: req.params.id }, {
//         $set: {
//             status: "INACTIVE"
//         }
//     })
//         .then(result => {
//             res.status(200).json({
//                 user: result
//             })
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             })

//         })
// })


export default router;