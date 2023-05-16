

import express from 'express';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';


config({
    path : './data/config.env',
})

export const app = express();

// using middlewares
// body parser
app.use(express.json())
app.use(cookieParser()) // this middleware parse thr cookie other wise you will not get token from cookie


// default route

// app.get("/", (req, res, next) =>{
//     res.send("working..")
// })

//routing
import userRouter from './routes/user.js';

app.use("/api/v1/user", userRouter)


// using error middleware
app.use(errorMiddleware)
  