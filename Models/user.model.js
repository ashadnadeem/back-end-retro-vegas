import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    name: String,
    phoneNo: String,
    address: String,
    role:{
        type: String,
        enum: ["ADMIN", "USER"],
        required: true
    },
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        required: true
    },
    customer_ID: String,
    store_ID: String,
});

userSchema.pre('save', async function (next) {
    try{
        if (this.isNew) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);
            this.password = hashedPassword;
        }
        next();
    }catch(err){
        next(err);
    }
});

userSchema.methods.isValidPassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        throw error;
    }
};

const User = mongoose.model('user', userSchema);
export default User;