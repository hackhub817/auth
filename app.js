//jshint esversion:6
// npm init - y to install pakage.json file
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");




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

const secret="thissialittlescret.";
userSchema.plugin(encrypt,{secret: secret, encryptedFields:["password"]});



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

app.post("/register",function(req,res)
{

const newUser = new User({
    email: req.body.username,
    password: req.body.password 
})

newUser.save()
  .then(() => {
    res.render("secrets");
  })
  .catch((err) => {
    console.log(err);
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
    if (foundUser && foundUser.password === password) {
      console.log("found");
      res.render("secrets");
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