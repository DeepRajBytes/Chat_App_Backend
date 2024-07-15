const asyncHandler = require('express-async-handler')
const User = require('../models/user.model');
const {generateToekn} = require('../config/jwt');
const bcrypt = require("bcrypt");

const userRegister = asyncHandler(async (req,res) => {
    const {name , email , password , pic} = req.body
    if(!name || !email || !password ){
        res.status(400).send("Please Fill Up All Deatils");
        throw new Error("Please Fill Up All Deatils");
    }
    const userExist = await User.findOne({email})

    if(userExist){
        throw new Error(`${email} is alredy Exists Please Login in case you forgot Password use Forgot password service`)
    }
    const hashedPassword = await bcrypt.hash(password, 8);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      picture: pic,
    });

    if(newUser){
        res.status(201).send({
          userdata: {
            name: newUser.name,
            email: newUser.email,
            picture: newUser.picture,
            _id: newUser._id,
          },
          token: generateToekn(newUser._id),
        });
    }else{
        throw new Error("Failed to Register COntact Support or try Other Email")
    }

})

const userLogin = asyncHandler(async(req ,res)=>{
    const {email , password} = req.body;

    const existUser = await User.findOne({email});

    if(!existUser){
        throw new Error(`${email} is not registered Please register first`)
    }

    const checkPass = await bcrypt.compare(password , existUser.password)

    if(!checkPass){
        throw new Error("Incorrect Password")
    }

    res.status(200).send({userdata : {
        name: existUser.name,
        email: existUser.email,
        picture: existUser.picture,
        _id : existUser._id,
    }, token : generateToekn(existUser._id)});
})


const userUpdate = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {new: true});

    if(!updatedUser){
        throw new Error("User Not Found");
    }
     res.status(200).send({
       userdata: {
         name: updatedUser.name,
         email: updatedUser.email,
         picture: updatedUser.picture,
         _id: updatedUser._id,
       },
       token: generateToekn(updatedUser._id),
     });
})

module.exports = {
  userRegister,
  userLogin,
  userUpdate,
};