import mongoose from "mongoose";

const userschema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  status:
  {
    type:Boolean,
    required:true
  }
 
})
const user=mongoose.model('user' , userschema)
export default user