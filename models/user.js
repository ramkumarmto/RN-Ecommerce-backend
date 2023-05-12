

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";




// a schema is a blueprint or structure that defines the shape and properties of a document in a MongoDB collection

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter Name"],
    // if anybody try to register without name then this mesaage will come
  },

  email: {
    type: String,
    required: [true, "Please Enter Email"],
    unique: [true, "Email Already Exist"],
    validate: validator.isEmail // this is used for valid format
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    minLength: [6, "Password must be at least 6 characters long"],
    // select: false, // when we fetch, password will not be fetched.
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },

  avatar: {
    public_id: String, // will fetch from cloudnary 
    url: String,
  },
  otp: Number, // why this is not required ?
  otp_expire: Date,
});

// whenever any user want to access password will be hashed incase of each user before saving.

//! this is about register
// hashing password
schema.pre("save", async function (next) {
  // we can't access value of this.password so we are using normal function in the above line
  // console.log(this.password);
  // here it is 10, more the number would be more complex password would be but it would be more time consuming
  // if (!this.isModified("password")) return next(); // why this is ?
  this.password = await bcrypt.hash(this.password, 10);
  // console.log(this.password)
});

//! method for login 
// why this is async function ? = when user will click login button then password will be compared with registered one
// so will fetch from backend 
//comparePassword => u can any name
schema.methods.comparePassword = async function (enteredPassword) {
  console.log("enteredPassword", enteredPassword)
  console.log("this.password", this.password)
  return await bcrypt.compare(enteredPassword, this.password);
  // it will return boolean either true | false 
};

// schema.methods.generateToken = function () {
//   return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });
// };

export const User = mongoose.model("User", schema);