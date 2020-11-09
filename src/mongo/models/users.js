import mongoose from "mongoose";
const {Schema} = mongoose;

const userSchema = new Schema({
    username: {type: String, required: true, unique: true}, 
    password: {type: String, required: true}, 
    email: {type: String, required: true, unique: true}, 
    data: {
        age: Number,
        isMale: Boolean
    }

},{timestamps: true });

const model = mongoose('User', userSchema);
module.exports = model;