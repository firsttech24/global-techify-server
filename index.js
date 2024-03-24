import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db/connectDb.js";

dotenv.config();
const app = express();
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

connectDB(DATABASE_URL);

app.listen(PORT, ()=>{
    console.log(`server listening at at ${PORT}`)
})
