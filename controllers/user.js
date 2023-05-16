import { asyncError } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/error.js";
import { cookieOptions, sendToken, getDataUri } from "../utils/features.js";
import cloudinary from 'cloudinary'

//!LOGIN
export const login = asyncError(async (req, res, next) => {
  const { email, password} = req.body;
  const user = await User.findOne({email});

  if(!user){
    return next( new ErrorHandler("incorrect Email or Password", 400))
  }
  // handle error which will do later 
  // now checking password from register 

  if(!password){
    return next( new ErrorHandler("incorrect Email or Password", 400))
  }
  const isMatched = await user.comparePassword(password);


  // try catch block or other error handlers
  // for example if user does not exist 

  if(!isMatched){
      // return next(new Error("Incorrect Password"))
      // by default error object have one parameter only and that is message
      // so that we will create a new error handler class now
      return next( new ErrorHandler("incorrect Email or Password", 400))
  }
//! token generated here
  const token = user.generateToken()

  //  res.status(201).json({
  //     success : true,
  //     message : `welcome back :  ${user.name}`,
  //     token
  // })  
  //! set cookies on res
  //   res.status(201).cookie("token", token, {
  //     expires : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
  //   }).json({
  //     success : true,
  //     message : `welcome back :  ${user.name}`,
  //     token
  // })  

  sendToken(user, res, `welcome back :  ${user.name}`, 200)


});

//!SIGNUP
export const signup = asyncError(async (req, res, next) => {
  // console.log(res.body);
const { name, email, password, address, city, country, pinCode } = req.body;

let user = await User.findOne({ email });
if(user) return next(new ErrorHandler("User allready exists", 400))

let avatar = undefined;

if(req.file){
  // req file
const file = getDataUri(req.file);
const myCloud = await cloudinary.v2.uploader.upload(file.content);

avatar = {
  public_id : myCloud.public_id,
  url  : myCloud.secure_url
}

}


// console.log(req.file)
// console.log(file)
// add clouldnary for image here



// console.log(myCloud.secure_url)
 user = await User.create({
  name,
  email,
  password,
  address,
  city,
  country,
  pinCode,
  avatar
});

// res.status(201).json({
//   success: true,
//   message: "registered successfully!",
// });
sendToken(user, res, "registered successfully!", 200);
});

//! LOGOUT
export const logout = asyncError( async(req, res ,next)=>{

  // const user = await User.findById(req.user._id);

  res.status(200).cookie("token" , "",{
    ...cookieOptions,
    expires : new Date(Date.now()),
  }).json({
    success : true,
    message : "Logged Out Successfully!"
  })

})
//! PROFILE
export const getMyProfile = asyncError( async(req, res ,next)=>{

  const user = await User.findById(req.user._id);

  res.status(200).json({
    success : true,
    user
  })

})
//! UPDATE PROFILE AND CHANGE PASSWORD
export const updateProfile = asyncError( async(req, res ,next)=>{

  const user = await User.findById(req.user._id);

  const { name, email, address, city, country, pinCode} = req.body;

  if(name) user.name = name;
  if(email) user.email = email;
  if(address) user.address = address;
  if(city) user.city = city;
  if(country) user.country = country;
  if(pinCode) user.pinCode = pinCode;

  await user.save();
  //! here password in not changing rgt even that pre.save() function is invoking and hashing the password. so need to modify

  res.status(200).json({
    success : true,
    message : "Profile updated successfully!"
  })

})
export const changePassword = asyncError( async(req, res ,next)=>{

  const user = await User.findById(req.user._id);

  const { oldPassword, newPassword} = req.body;

  if(!oldPassword || !newPassword) return next( new ErrorHandler("Please Enter Old and new Password", 400))

  const isMatched = await user.comparePassword(oldPassword);

  if(!isMatched) return next(new ErrorHandler("Incorrect Old Password", 400))

  user.password = newPassword;

  await user.save()
  // password will be hashed automatically
  // whenever user.save() function will invoke the save function will automatically will be invoke which is written in models file

  res.status(200).json({
    success : true,
    message : "Password changed Successfully!"
  })

})

//! UPDATE PIC
export const updatePic = asyncError( async(req, res ,next)=>{

  const user = await User.findById(req.user._id);

  res.status(200).json({
    success : true,
    user
  })

})