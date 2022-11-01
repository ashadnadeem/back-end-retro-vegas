import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const storeSchema = new Schema({
    userID: {
        type: String,
        required: true,
        unique: true,
    },
    products: Array,
    name: String,
    rating: Number,
    trustedSeller: Boolean,
    orders: Array,

});

const Store = mongoose.model('store', storeSchema);
export default Store;