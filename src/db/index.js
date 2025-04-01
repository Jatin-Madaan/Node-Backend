import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`);
        console.log(`\n MOngoDB connected !! DB Host: ${connInstance.connection.host}`);
    } catch (error) {
        console.log("MONGO DB CONNECTION ERROR : ", error);
        process.exit(1);
    }
}

export default connectDB;