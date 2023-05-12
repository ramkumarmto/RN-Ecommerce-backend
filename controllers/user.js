import { User } from "../models/user.js";
export const login = async (req, res, next) => {
    const { email, password} = req.body;
    console.log("login body", req.body);

    const user = await User.findOne({email});

    // handle error which will do later 

    // now checking password from register

    
    const isMatched = await user.comparePassword(password);
    
    console.log("hello ")

    console.log("isMatched", isMatched);

    // try catch block or other error handlers
    // for example if user does not exist 

    if(!isMatched){
        return res.status(400).json({
            success : false,
            message : "Incorrect Password"
        })
    }
     res.status(201).json({
        success : true,
        message : `welcome back :  ${user.name}`
    })
};

export const signup = async (req, res, next) => {
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
};
