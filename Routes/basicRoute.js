const express=require('express');

const route=express.Router();

route.get('/',(req,res)=>{
res.render("index.ejs");
});

route.get('/about',(req,res)=>{
    res.send("this is the about page ");
});
route.get('/contact',(req,res)=>{
    res.send("contact at nikhil.64360@gmail.com");
});

module.exports=route;