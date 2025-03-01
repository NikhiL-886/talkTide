const express= require('express');
const route=express.Router();
const jwt= require('jsonwebtoken');
const {User}=require('../userSchema/user');
const {generateAccessToken,generateRefreshToken,verifyAccessToken}=require('../utils/authentication');


route.post("/logout",async(req,res)=>{
    const receivedAccessToken=req.cookies['accessToken'];
    const receivedRefreshToken=req.cookies['refreshToken'];
    if(!receivedAccessToken){
        if(!receivedRefreshToken){
            return res.status(200).send("Both tokens are expired.Re-login to access the resource");
        }else{
            return res.status(200).send("AccessToken is expired.Generate a new one through refreshToken");
        }
    }
    const accessInput=verifyAccessToken(receivedAccessToken);
    if(accessInput==="otherError"){
        return res.status(500).send("Server-Side Error verrifying the accessToken of the user or the accessToken is tampered");
    }else{
        res.cookie('accessToken',null,{
            sameSite:'None',
            expires:new Date(0)
        });
        res.cookie('refreshToken',null,{
            sameSite:'None',
            expires:new Date(0)
        });
        res.status(200).send("User is logged out successfully");
    } 
});
route.post("/login",async (req,res)=>{

const {email,password}=req.body;
const retrievedUser=await User.findOne({email:email});
if(!retrievedUser){
   return  res.status(200).json({message:"User doesn't exist with the provided email .Create a new account"});
}
retrievedUser.checkPassword(password,function(err,isMatch){
    if(err){
        console.log(err);
        res.status(500).send("There is a serverSide error verfying the given credentials");
    }else{
        if(isMatch){
            const payload={
                username:retrievedUser.username,
                email:retrievedUser.email,

            }
            const accessToken=generateAccessToken(payload);
            if(!accessToken){
                return res.status(500).send("Server-Side error while login");
            }
            const refreshToken=generateRefreshToken(payload);
            if(!refreshToken){
                return res.status(500).send("Server-Side Error while login ");
            }


            res.cookie('refreshToken',refreshToken,{
                sameSite:'None',
                maxAge:1*60*60*1000
            });
            res.cookie('accessToken',accessToken,{
                sameSite:'None',
                maxAge:2*60*60*1000
            });
            res.status(200).send("User is Logged in");


        }else{
            res.status(200).send("Password is incorrect");
        }
    }
});



});
route.post("/register",async (req,res)=>{
    const {username,email,password}=req.body;
    if(await User.findOne({email:email})){
        console.log("User existed with the provided email");
        res.status(200).json({message:"User already exist with the provided email"});
    }else{
        const user=new User({
            username:username,
            email:email,
            password:password
        });
        await user.save();
        const currSavedUser= await User.findOne({email:email});
        res.status(200).json({message:`user saved with id:${currSavedUser._id} and the crypted password is ${currSavedUser.password}`});
        console.log(`user saved with id: ${currSavedUser._id}`);
    }
    


});

module.exports=route;