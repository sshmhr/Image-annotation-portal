if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const initializePassport = require("./passport-config.js");
const functionLibrary = require("./function-library.js");
const variables = require("./variables.js");
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const assert = require('assert');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const MongoClient =  require('mongodb').MongoClient;

const app = express();

app.set('view-engine','ejs');
app.use(express.urlencoded({extended : false}));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: true}))

initializePassport(passport);
functionLibrary.initializeMulter();

let upload = variables.upload.array('files',15);

app.post("/upload",async (req,res,next)=>{

    upload(req,res,async (err)=>{
        try {
            if(err) throw err;
            await functionLibrary.addImageToDB(req,res);
            req.session.adminMessage = "file uploaded successfully ";
            res.redirect("/admin");
        } catch (error) {
            req.session.adminMessage = error.toString() ;
            res.redirect("/admin");
        }
    });
})

app.get("/",functionLibrary.checkAuthenticated,(req,res)=>{
    if((req.session.passport.user.userType).includes("user")) res.redirect("/user");
    else res.redirect("/admin");
});

app.get("/login",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs');
});

app.get("/login/user",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('loginUser.ejs');
});

app.get("/login/admin",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('loginAdmin.ejs');
});

app.get("/register",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs',{ session: req.session });
});

app.get("/user",functionLibrary.checkAuthenticated,functionLibrary.isUser,(req,res)=>{
    res.render('user.ejs',{ name: req.user.name });
});

app.get("/admin",functionLibrary.checkAuthenticated,functionLibrary.isAdmin,(req,res)=>{
    res.render('admin.ejs',{ name: req.user.name , session: req.session});
});

app.post("/register",functionLibrary.checkNotAuthenticated,async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        existingUser = await functionLibrary.getUserByEmail(req.body.userType,req.body.email);
        if(existingUser!=undefined) throw "User with this email already exists";
        await functionLibrary.storeData(hashedPassword,req);
        res.redirect("/login");
    } catch (error) {
        req.session.error = error;
        res.redirect("/register");
    }
});

app.post('/login/admin',functionLibrary.checkNotAuthenticated,functionLibrary.addUserTypeAdmin, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login/admin',
    failureFlash: true
}))

app.post('/login/user',functionLibrary.checkNotAuthenticated, functionLibrary.addUserTypeUser,passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login/user',
    failureFlash: true
}))

app.delete('/logout',functionLibrary.checkAuthenticated,(req,res)=>{
    req.logOut();
    res.redirect('/login');
});

app.get("*",(req,res)=>{
    res.redirect("/");
})

app.listen("4000");