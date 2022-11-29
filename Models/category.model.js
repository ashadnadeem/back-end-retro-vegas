import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    imageUrl: String,
    parentID: String,
    status: String,
});

const Category = mongoose.model('category', categorySchema);
export default Category;