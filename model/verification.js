import mongoose from "mongoose";

const verifySchema =mongoose.Schema({
    email:String,
    token:String,
    status:Boolean,
    expireIn:Number
})

const Verifiytoken=mongoose.model('emailverifytoken', verifySchema);
export default Verifiytoken