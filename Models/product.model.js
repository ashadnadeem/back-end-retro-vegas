import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    picture: String,
    storeID: {
        type: String,
        required: true,
    },
    categoryID: String,
    description: String,
    bid_settings: String,
    bids: Array,
    status: String,
});

const Product = mongoose.model('product', productSchema);
export default Product;