//jshint esversion:6
// npm init - y to install pakage.json file
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const bcrypt=require("bcrypt");
const saltRounds=10;

// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");




const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//database connect
mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2",{
  dbName: 'UserDB',
},{useNewUrlParser:true},).then(()=>console.log('connect database'))
.catch((err)=>{console.log(err);});



//shema new mongoose is written here to give the thing that are important for special database
const userSchema= new mongoose.Schema({
    email:String,
    password:String
});

///level 2 security cipher method 
// it is less secure so we have used level 3 security

// const secret="thissialittlescret.";
// userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]});



const User = new mongoose.model("User",userSchema);




app.get("/",function(req,res)
{
    res.render("home");
});

app.get("/login",function(req,res)
{
    res.render("login");
});

app.get("/register",function(req,res)
{
    res.render("register");
});

//THIS IS THE LEVEL 4 SECURITY IN WHICH ONE SALTED IS USED

// app.post("/register",function(req,res)
// {

//   bcrypt.hash(req.body.password,saltRounds , function(err,hash)
//   {
//     const newUser = new User({
//       email: req.body.username,
//       password: hash
//   });
//   newUser.save()
//   .then(() => {
//     res.render("secrets");
//   })
//   .catch((err) => {
//     console.log(err);
//   });
   
//   });
// });








app.post("/register",function(req,res)
{

  bcrypt.hash(req.body.password,saltRounds , function(err,hash)
  {
    const newUser = new User({
      email: req.body.username,
      password: hash
  });
  newUser.save()
  .then(() => {
    res.render("secrets");
  })
  .catch((err) => {
    console.log(err);
  });
   
  });
});

app.post("/login" ,function(req,res)
{
const username=req.body.username;
const password= req.body.password;
console.log(password);

//to find email in the database wherether its present or not
User.findOne({ email: username })
  .then(foundUser => {
    if (foundUser) {
      bcrypt.compare(req.body.password,foundUser.password , function(err,result)
      {
        if(result==true)
        {
          console.log("found");
          res.render("secrets");
        }else
        {
          console.log("not");
        }
      });
      
    }else{
      console.log("not found");
    }
  })
  .catch(err => {
    console.log(err);
  });

});















app.listen(2000,function()
{
console.log("Successfully run at 2000");
})  