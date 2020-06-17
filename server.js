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

const app = express();
initializePassport(passport);
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

app.get("/",functionLibrary.checkAuthenticated,(req,res)=>{
    res.render('index.ejs',{ name: req.user.name });
});

app.get("/login",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs');
});

app.get("/register",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs');
});

app.post("/register",functionLibrary.checkNotAuthenticated,async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        functionLibrary.storeData(hashedPassword,req);
        res.redirect("/login");
    } catch (error) {
        res.redirect("/register");
    }
    console.log(variables.users);
});

app.post('/login',functionLibrary.checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))

app.delete('/logout',functionLibrary.checkAuthenticated,(req,res)=>{
    req.logOut();
    res.redirect('/login');
});



app.listen("4000");