import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";

//!LOGIN
export const login = asyncError(async (req, res, next) => {
  const { email, password} = req.body;
  const user = await User.findOne({email});
  // handle error which will do later 
  // now checking password from register 
  const isMatched = await user.comparePassword(password);


  // try catch block or other error handlers
  // for example if user does not exist 

  if(!isMatched){
      // return next(new Error("Incorrect Password"))
      //! by default error object have one parameter only and that is message
      //! so that we will create a new error handler class now
      return next( new ErrorHandler("incorrect Password", 400))
  }
   res.status(201).json({
      success : true,
      message : `welcome back :  ${user.name}`
  })   
});

//!SIGNUP
export const signup = asyncError(async (req, res, next) => {
  // console.log(res.body);
const { name, email, password, address, city, country, pinCode } = req.body;
// add clouldnary for image here
await User.create({
  name,
  email,
  password,
  address,
  city,
  country,
  pinCode,
});

res.status(201).json({
  success: true,
  message: "registered successfully!",
});
});
