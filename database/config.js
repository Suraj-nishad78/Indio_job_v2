import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const MONGODB_URL = process.env.MONGDB_SERVER;

export const connectToDb = async() =>{
    try{
        await mongoose.connect(MONGODB_URL)
        console.log('Database connected ✅');
    } catch(err){
        console.log("Error while connecting to DB: ", err);
    }
}