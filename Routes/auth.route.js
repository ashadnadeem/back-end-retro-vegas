// Import the modules from package
import { Router } from 'express';
const router = Router();
import createError from 'http-errors';
// Import the Data Models
import User from '../Models/user.model.js';
import Customer from '../Models/customer.model.js';
import Store from '../Models/store.model.js';
import {Header, Response} from '../Models/response.model.js';

// Import the validation schema
import {authSchema} from '../helpers/validation_schema.js';
// Import the JWT helper
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../helpers/jwt_helper.js';

// Register Route
router.post('/register', async(req, res, next) => {
    try {
        // Validate the email and password
        const validReq = await authSchema.validateAsync(req.body);
        
        // Check if user already exists
        const doesExist = await User.findOne({email: validReq.email});
        if(doesExist) res.status(200).json(
            Response(Header(1, null, `A user with ${validReq.email} is already registered`))
        );

        // Create new user
        const user = User({
            email: validReq.email,
            password: validReq.password,
            name: validReq.name,
            phoneNo: validReq.phoneNo,
            role: "USER",
            status:"ACTIVE",
        });

        const savedUser = await user.save();

        const customer = Customer({
            userID: savedUser.id,
            cart: [],
            favs: [],
            orders: []
        });
        const savedCust = await customer.save();

        const store = Store({
            userID: savedUser.id,
            products: [],
            name: savedUser.name,
            rating: 0,
            trustedSeller: false,
            orders: [],
        });
        const savedStore = await store.save();

        User.findOneAndUpdate({ _id: savedUser.id }, {
            $set: {
                customer_ID: savedCust.id,
                store_ID: savedStore.id,
            }
        }).then(async(result) => {
             
            // Generate JWT access tokens{accessToken, refreshToken}
            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken = await signRefreshToken(savedUser.id);

            const user = result;
       
            res.status(200).json(
                Response(Header(0, null, null),{accessToken, refreshToken, user})
            );
        })
        .catch(err => {
            res.status(200).json(
                Response(Header(1, null, 'An unknown error has occured.'))
            );
        })
    
    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if(error.isJoi === true) error.status = 422;
        if(error.isJoi === true) error.status = 422;
        res.status(200).json(
            Response(Header(1, error.status, error))
        );
    }
});

// Login Route
router.post('/login', async(req, res, next) => {
    try {
        // validate the email and password
        const validReq = await authSchema.validateAsync(req.body);

        // Check if user exists
        const user = await User.findOne({email: validReq.email});
        if(!user) res.status(200).json(
            Response(Header(1, null, "User not found!"))
        );
        // Check if password is correct
        const isMatched = await user.isValidPassword(validReq.password);
        if(!isMatched) res.status(200).json(
            Response(Header(1, null, "Invalid Password"))
        );

        // Generate JWT access tokens{accessToken, refreshToken}
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        
        // Send the tokens
        res.status(200).json(
            Response(Header(0, null, null),{accessToken, refreshToken, user})
        );

    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if(error.isJoi === true) error.status = 422;
        res.status(200).json(
            Response(Header(1, error.status, 'Invalid email or password'))
        );
    }
});

// refresh token Route
router.post('/refresh_token', async(req, res, next) => {
    try {
        let {refreshToken} = req.body;
        if(!refreshToken) throw BadRequest();
        // Verify the refresh token
        const userID = await verifyRefreshToken(refreshToken);

        // Generate new access tokens{accessToken, refreshToken}
        const accessToken = await signAccessToken(userID);
        refreshToken = await signRefreshToken(userID);
        // Send the new access token and refresh token
        res.send({accessToken, refreshToken});
    } catch (error) {
        next(error);
    }
});

// Logout Route
router.delete('/logout', async(req, res, next) => {
    res.send('Logout Route');
});

export default router;