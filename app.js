const express = require('express');
const morgan = require('morgan');
const create_error = require('http-errors');
require('dotenv').config();
require('./helpers/init_mongodb');

const Auth_Route = require('./Routes/auth.route');
const User_Route = require('./Routes/user.route');

const {verifyAccessToken} = require('./helpers/jwt_helper');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Root Route
app.get('/', verifyAccessToken, async(req, res, next) => {
    res.send('Hello World! \nYou are at the root route\nYou have Authorised access.');
});

// Users Route
app.use('/user', verifyAccessToken, User_Route);

// Auth Route
app.use('/auth', Auth_Route);

// Error Handler
app.use(async(req, res, next) => {
    next(create_error.NotFound("Not Found Error"));
});

app.use(async(err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    });
});


// Start Server to listen
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});