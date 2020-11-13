const mongoose = require("mongoose");
const {Schema} = mongoose;

const lostSchema = new Schema({

    email: {type: String, required: true}, 
    data: { type: String, required: true}

},{timestamps: true });


const lostpass = mongoose.model('Lostpassword', lostSchema);
module.exports =  lostpass;