//jshint esversion:6
// npm init - y to install pakage.json file
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const session=require("express-session");
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
// const bcrypt=require("bcrypt");
// const saltRounds=10;

// const md5 = require("md5");
// const encrypt = require("mongoose-encryption");




const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
//THIS PLACE IS FIXED
//INTILAZATION 

app.use(session({
  secret:"Our little secret.",
  resave:false,
  saveUninitialized:false
}));

//INTIALISING PAASPORT
app.use(passport.initialize());
app.use(passport.session());



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


//PLUGIN MONGOSCHEMA
userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);


const User = new mongoose.model("User",userSchema);

// yeh sayad ham session ko exprire karne ke liye use kartay h
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



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


app.get("/secrets" , function (req,res)
{
  if(req.isAuthenticated())
  {
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});

app.get("/logout",function(req,res){
 req.logout(function(err){
  if(err)
  {
    console.log(err);
  }else{
    res.redirect("/");
  }
 });
//  res.redirect('/'); 
});

app.post("/register",function(req,res)
{
  User.register({username:req.body.username}, req.body.password, function(err, user) {
    if(err)
     {
      console.log(err);
      res.redirect("/register");
    }
    else
    { 
    User.authenticate("local")(req ,res ,function() {
      res.redirect("/secrets");
      });
    } 
});
});

app.post("/login" ,function(req,res)
{
const user = new User({
  username:req.body.username,
  password:req.body.password
});

req.login(user,function(err)
{
  if(err)
  {
    console.log(err);
  }else{
    passport.authenticate("local")(req,res,function()
    {
      res.redirect("/secrets");
    });
  }
});

});







// app.get("/logout", function(req, res){
//   req.logout();
//   res.redirect("/");
// });





app.listen(2000,function()
{
console.log("Successfully run at 2000");
}) 