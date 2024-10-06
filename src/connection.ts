import mongoose from "mongoose";


const connectMongoDB = async (url: string)=>{
return mongoose.connect(url);

}


export default connectMongoDB;