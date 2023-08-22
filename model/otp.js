import mongoose from "mongoose";

const Otpschema=mongoose.Schema({

    email:String,
    code:String,
    expireIn:Number
})

let otp=mongoose.model('otp', Otpschema);
export default otp;