
import connectDB from "./db/index.js";
import dotenv from 'dotenv';
import { app } from './app.js';

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
connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("Mongo db connection failed : ", err);
});