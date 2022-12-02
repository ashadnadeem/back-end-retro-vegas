// Import the modules from package
import { Router } from 'express';
const router = Router();
import bcrypt from 'bcrypt';
import User from '../Models/user.model.js';
import { verifyAccessToken } from '../helpers/jwt_helper.js';
import {userSchema} from '../helpers/validation_schema.js';
import {Header, Response} from '../Models/response.model.js';


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

        res.status(200).json(
            Response(Header(0, null, null),{users: result})
        );

    } catch (error) {
        res.status(200).json(
            Response(Header(1, 500, error))
        );
    }
});


//Read User by id
router.get('/:id', verifyAccessToken, async(req, res, next) => {
    const id = req.payload.aud;
    if(id == req.params.id) {
        User.findById(id)
            .then(doc => {
            if (doc) {
                res.status(200).json(
                    Response(Header(0, null, null),{
                        user: doc,
                    })
                );
            } else {
                res.status(200).json(
                    Response(Header(1, 404, "No valid entry found for provided ID"))
                );
            }
            })
            .catch(err => {
                console.log(err);
                res.status(200).json(
                    Response(Header(1, 500, err))
                );
            }
        );
    } else{
        res.status(200).json(
            Response(Header(1, 404, "Unauthorized"))
        );
    }
});

//Update User
router.put('/:id', verifyAccessToken, async(req, res, next)=>{
    const id = req.payload.aud;
    if(id == req.params.id) {
    const result = await userSchema.validateAsync(req.body);
    User.findOneAndUpdate({ _id: req.params.id }, {
                $set: {
                    name: result.name,
                    phoneNo: result.phoneNo,
                    address: result.address,
                }
            })
                .then(result => {
                    res.status(200).json(
                        Response(Header(0, null, null),{users: result})
                    );
                })
                .catch(err => {
                    console.log(err);
                    res.status(200).json(
                        Response(Header(1, 500, err))
                    );
                })
} else {
    res.status(200).json(
        Response(Header(1, 404, "Unauthorized"))
    );
}   
});

//delete User
router.delete('/:id', verifyAccessToken, async (req, res, next) => {

    User.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json(
                Response(Header(0, null, null),{users: result})
            );
        })
        .catch(err => {
            console.log(err);
            res.status(200).json(
                Response(Header(1, 500, err))
            );

        })
})


export default router;