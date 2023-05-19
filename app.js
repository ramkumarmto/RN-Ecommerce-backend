

import express from 'express';
import { config } from 'dotenv';
import { errorMiddleware } from './middlewares/error.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


config({
    path : './data/config.env',
})

export const app = express();

// using middlewares
// body parser
app.use(express.json())
app.use(cookieParser()) // this middleware parse thr cookie other wise you will not get token from cookie
app.use(cors({
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE"],
    origin : [process.env.FRONTEND_URI_1, process.env.FRONTEND_URI_2]
    // one may be for mobile application one for web application
}))

// default route

// app.get("/", (req, res, next) =>{
//     res.send("working..")
// })

//routing
import userRouter from './routes/user.js';
import productRouter from './routes/product.js';
import orderRouter from './routes/order.js'

app.use("/api/v1/user", userRouter);
app.use("/api/v1/product",productRouter );
app.use("/api/v1/order",orderRouter );


// using error middleware
app.use(errorMiddleware)
  