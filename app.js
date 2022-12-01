import express, { json, urlencoded } from 'express';
import morgan from 'morgan';
import createError from 'http-errors';
import { config } from 'dotenv';
import { } from './helpers/init_mongodb.js';
import cors from 'cors'
import Auth_Route from './Routes/auth.route.js';
import User_Route from './Routes/user.route.js';
import Customer_Route from './Routes/customer.route.js';
import Store_Route from './Routes/store.route.js';
import Category_Route from './Routes/category.route.js';
import Product_Route from './Routes/product.route.js';

import { verifyAccessToken } from './helpers/jwt_helper.js';

const app = express();
config();

app.use(morgan('dev'));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());

// Root Route
app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send('Hello World! \nYou are at the root route\nYou have Authorised access.');
});

// Users Route
app.use('/user', verifyAccessToken, User_Route);

// Customer Route
app.use('/customer', verifyAccessToken, Customer_Route);

// Store Route
app.use('/store', verifyAccessToken, Store_Route);

// Auth Route
app.use('/auth', Auth_Route);

// Category Route
app.use('/category', Category_Route);

//Product Route
app.use('/product', Product_Route);

// Error Handler
app.use(async (req, res, next) => {
    next(createError.NotFound("Not Found Error"));
});

app.use(async (err, req, res, next) => {
    console.log('x');
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