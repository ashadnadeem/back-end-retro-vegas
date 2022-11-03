import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerID: {
        type: String,
        required: true,
    },
    total_amount: Number,
    address: String,
    order_date_time: Date,
    delivery_date_time: Date,
    status:{
        type: String,
        enum: ["Cancelled", "Delivered", "Shipped", "Pending"],
    },
});

const Order = mongoose.model('order', orderSchema);
export default Order;