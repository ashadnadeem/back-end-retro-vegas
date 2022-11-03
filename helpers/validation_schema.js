import JOI from '@hapi/joi';

export const authSchema = JOI.object({
    email: JOI.string().email().required(),
    password: JOI.string().min(8).required(),
    name: JOI.string(),
    phoneNo: JOI.string().min(11).max(11),
});

export const userSchema = JOI.object({
    _id: JOI.string,
    email: JOI.string().email().required(),
    password: JOI.string().min(8).required(),
    name: JOI.string(),
    phoneNo: JOI.string().min(11).max(11),
    address: JOI.string(),
    role: JOI.string(),
    status:JOI.string(),
    customer_ID: JOI.string(),
    store_ID: JOI.string(),
});

export const customerSchema = JOI.object({
    userID: JOI.string(),
    cart: JOI.array(),
    favs: JOI.array(),
    orders: JOI.array(),
});

export const storeSchema = JOI.object({
    userID: JOI.string(),
    products: JOI.array(),
    name: JOI.string(),
    rating: JOI.number(),
    trustedSeller: JOI.boolean(),
    orders: JOI.array(),
});

export const orderSchema = JOI.object({
    customerID: JOI.string(),
    total_amount: JOI.number(),
    address: JOI.string(),
    order_date_time: JOI.date(),
    delivery_date_time: JOI.date(),
    status: JOI.string(),
});

export const orderProductSchema = JOI.object({
    productID: JOI.string(),
    orderID: JOI.string(),
    discount: JOI.number(),
    quantity: JOI.number(),
});