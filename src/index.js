import connectDB from "./db/index.js";
import dotenv from 'dotenv';

dotenv.config()
/*
import express from 'express';
const app = express();
(async () => {
    try{
        mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
        app.on("error", (err) => {
            console.log("Error : ", err);
            throw err;
        });
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on PORT : ${process.env.PORT}`);
        })
    }catch(error){
        console.log("Error : ", error);
        throw error;
    }
})();
*/
connectDB();