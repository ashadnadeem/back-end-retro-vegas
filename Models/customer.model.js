import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const customerSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    cart: Array,
    favs: Array,
    orders: Array,

});

const Customer = mongoose.model('customer', customerSchema);
export default Customer;