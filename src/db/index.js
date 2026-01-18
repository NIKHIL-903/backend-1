import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"  


const connectDB= async()=>{
    console.log("MONGODB_URL =", process.env.MONGODB_URL);
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
    }catch(error) {
        console.log("MongoDB connect Error",error)
        process.exit(1);
    }
}

export default connectDB