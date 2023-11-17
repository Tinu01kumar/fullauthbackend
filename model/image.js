import mongoose from "mongoose";

const ImageSchema=mongoose.Schema({

    email:String,
    image:String,
 
})

let imagefile=mongoose.model('imagefile', ImageSchema);
export default imagefile;