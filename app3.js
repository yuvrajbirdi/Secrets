//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//to access .env variables
//console.log(process.env.SECRET);

//Database
connect().catch(err=> console.log(err));

async function connect(){
    await mongoose.connect("mongodb://127.0.0.1/userDB");
    console.log("Connected to database!");
}

//change normal js object schema to mongoose schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//secret for encyption

//we add the encypt package as a plugin
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields:["password"] });


const User = new mongoose.model("User", userSchema);


//Routing
app.get("/", function(req, res){
    res.render("home");
});

app.get("/login", function(req, res){
    res.render("login");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });

    newUser.save();

    res.render("secrets");
});

app.post("/login", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    fOne().catch(err=> console.log(err));

    async function fOne(){
        const foundUser = await User.findOne({email: username});

        if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        } 
    }
});

app.listen(3000, function(){
    console.log("Server connected on port 3000");
});

