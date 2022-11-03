import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderProductSchema = new Schema({
    productID: {
        type: String,
        required: true,
    },
    orderID: {
        type: String,
        required: true,
    },
    discount: Number,
    quantity: Number,
    status: {
        type: String,
        enum: ["Deleted", "Active"]
    }
});

const OrderProduct = mongoose.model('order_product', orderProductSchema);
export default OrderProduct;