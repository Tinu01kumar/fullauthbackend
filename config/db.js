import mongoose from "mongoose";


const connection=async(username , password)=>{
    const URL=`mongodb+srv://${username}:${password}@cluster0.jz7ibvs.mongodb.net/?retryWrites=true&w=majority`;
    try{
        await mongoose.connect(URL, {useNewUrlParser:true,  useUnifiedTopology: true});
        console.log('database is connected successfullly');
    }catch(error){
        console.log('error while connecting database ' , error)
    }
};

export default connection;
