// Import the modules from package
const express = require('express');
const router = express.Router();
const create_error = require('http-errors');
// Import the Data Models
const User = require('../Models/user.model');
// Import the validation schema
const {authSchema} = require('../helpers/validation_schema');
// Import the JWT helper
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../helpers/jwt_helper');

// Register Route
router.post('/register', async(req, res, next) => {
    try {
        // Validate the email and password
        const validReq = await authSchema.validateAsync(req.body);
        console.log(validReq);
        // Check if user already exists
        const doesExist = await User.findOne({email: validReq.email});
        if(doesExist) throw create_error.Conflict(`A user with ${validReq.email} is already registered`);
        
        // Create new user
        const user = User(validReq);
        const saved = await user.save();
        // Generate JWT access tokens{accessToken, refreshToken}
        const accessToken = await signAccessToken(saved.id);
        const refreshToken = await signRefreshToken(saved.id);
        // Send the tokens to the client
        res.send({accessToken, refreshToken});
    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if(error.isJoi === true) error.status = 422;
        next(error);
    }
});

// Login Route
router.post('/login', async(req, res, next) => {
    try {
        // validate the email and password
        const validReq = await authSchema.validateAsync(req.body);

        // Check if user exists
        const user = await User.findOne({email: validReq.email});
        if(!user) throw create_error.NotFound('User not registered');

        // Check if password is correct
        const isMatched = await user.isValidPassword(validReq.password);
        if(!isMatched) throw create_error.Unauthorized('Username/Password not valid');

        // Generate JWT access tokens{accessToken, refreshToken}
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);
        // Send the tokens
        res.send({accessToken, refreshToken});

    } catch (error) {
        // Check if error is from joi validation then send unaccessible property error
        if(error.isJoi === true) next(create_error.BadRequest("Invalid Email or Password"));
        next(error);
    }
});

// refresh token Route
router.post('/refresh_token', async(req, res, next) => {
    try {
        let {refreshToken} = req.body;
        if(!refreshToken) throw create_error.BadRequest();
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

module.exports = router;