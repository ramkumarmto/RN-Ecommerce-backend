

import express from 'express';
import { config } from 'dotenv';


config({
    path : './data/config.env',
})

export const app = express();

// using middlewares
// body parser
app.use(express.json())


// default route

// app.get("/", (req, res, next) =>{
//     res.send("working..")
// })

//routing
import userRouter from './routes/user.js';

app.use("/api/v1/user", userRouter)
  