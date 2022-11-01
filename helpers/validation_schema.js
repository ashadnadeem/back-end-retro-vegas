import JOI from '@hapi/joi';

export const authSchema = JOI.object({
    email: JOI.string().email().required(),
    password: JOI.string().min(8).required(),
    name: JOI.string(),
    phoneNo: JOI.string().min(11).max(11),
});

export const userSchema = JOI.object({
    _id: JOI.number(),
    email: JOI.string().email().required(),
    password: JOI.string().min(8).required(),
    name: JOI.string(),
    phoneNo: JOI.string().min(11).max(11),
    address: JOI.string(),
    role: JOI.string(),
    status:JOI.string(),
    customer_ID: JOI.number(),
    store_ID: JOI.number(),
});
