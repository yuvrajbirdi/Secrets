//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

//Database
connect().catch(err=> console.log(err));

async function connect(){
    await mongoose.connect("mongodb://127.0.0.1/userDB");
    console.log("Connected to database!");
}

const userScema = {
    email: String,
    password: String
};

const User = new mongoose.model("User", userScema);


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

