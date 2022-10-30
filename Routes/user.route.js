// Import the modules from package
const express = require('express');
const router = express.Router();
const create_error = require('http-errors');
const JWT = require('jsonwebtoken');
// Import the Data Models
const User = require('../Models/user.model');

// Get all users
router.get('/getAll', async(req, res, next) => {
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

// Get my details
router.get('/getMyDetails', async(req, res, next) => {
    try {
        const token = req.headers['authorization'].split(' ')[1];
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const payload = JWT.verify(token, secret);
        const id = payload.aud;
        const user = await User.findOne({_id: id});
        if(!user) return next(create_error.NotFound('User not found'));
        res.send({
            id: user._id,
            email: user.email,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;