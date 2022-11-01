// Import the modules from package
import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import User from '../Models/user.model.js';
import { verifyAccessToken } from '../helpers/jwt_helper.js';
import {userSchema} from '../helpers/validation_schema.js'

// Get all users
router.get('/all', async(req, res, next) => {
    try {
        const user_list = await User.find();
        let result = [];
        user_list.forEach(user => {
            result.push({
                id: user._id,
                email: user.email,
            });
        });

        res.send({users: result});
    } catch (error) {
        next(error);
    }
});


//Read User by id
router.get('/:id', verifyAccessToken, async(req, res, next) => {
    const id = req.payload.aud;
    if(id == req.params.id) {
        User.findById(id)
            .then(doc => {
            if (doc) {
                res.status(200).json({
                    user: doc,
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
    }
});

//Update User
router.put('/:id', verifyAccessToken, async(req, res, next)=>{
    
    const result = await userSchema.validateAsync(req.body);
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        }
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    email: result.email,
                    password: result.password,
                    name: result.name,
                    phoneNo: result.phoneNo,
                    role: result.role,
                    status: result.status,
                    address: result.address,
                }
            })
                .then(result => {
                    res.status(200).json({
                        updated_User: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        }
    })
});

//delete User
router.delete('/:id', verifyAccessToken, async (req, res, next) => {

    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json({
                updated_user: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})


export default router;