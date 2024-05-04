import mongoose from "mongoose"
import dotenv from "dotenv";
dotenv.config()

const connectToMongoDB=async()=>{
    try{
        await mongoose.connect(process.env.Mongo_DB_URI)
        console.log("connected to db")
    }
    catch(error){
        console.log("failed to connect",error.message)
    }
};
export default connectToMongoDB