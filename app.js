require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({  extended: true}));
app.use(express.static("public"));

//  Database Security...
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/userDB");


const userSchema = new mongoose.Schema({
     email: String,
     password: String
})


userSchema.plugin(encrypt,{secret:process.env.SECRET ,encryptedFields:["password"] });

const User = new mongoose.model("User",userSchema);

//   Read...

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/logout",(req,res)=>{
    res.render("home");
})

app.post("/register",(req,res)=>{
    const newUser =  new User({
        email:req.body.username,
        password: req.body.password
    })
    newUser.save((err)=>{
        if(!err){
            res.render("secrets");
        }
    })
})

app.post("/login",(req,res)=>{
    const username =req.body.username;
    const password = req.body.password;

    User.findOne({email:username},(err,foundUser)=>{
        if(!err){
            if(foundUser){
                if(foundUser.password === password){
                            res.render("secrets");
                }
            }
        }
    })
})





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
