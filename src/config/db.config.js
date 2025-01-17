import mongoose from "mongoose";
import getEnv from "./envConfig.js";

const connectDB = async()=>{
    try {
        await mongoose.connect(getEnv.DB_URL).then((connect)=>{
            console.log('Connected to the database on host',connect.connection.host);
        }).catch((error)=>{
            console.log("Error connecting the database", error);
        })
    } catch (error) {
        throw new Error('Error connecting to the database');
    }
}

export default connectDB;