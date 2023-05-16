import ErrorHandler from "../utils/error.js";
import { User } from "../models/user.js";
import  jwt  from "jsonwebtoken";
import { asyncError } from "./error.js";



export const isAuthenticated = asyncError(async (req, res, next)=>{

    // console.log("cookies", req.cookies)
    const token = req.cookies.token;

    if(!token ) return next( new ErrorHandler("not logged in", 401))

    //! if user is logged in then we will save into req.user so that we can use user throughout the application

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("decodeData", decodeData);
    // decodeData { _id: '645cd38a0a6591de40a39d8d', iat: 1684143093, exp: 1685439093 }

    req.user = await User.findById(decodeData._id);


    // console.log("requesting user",req.user) // user's object

    next();
});