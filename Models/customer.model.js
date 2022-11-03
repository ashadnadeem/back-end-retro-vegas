import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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