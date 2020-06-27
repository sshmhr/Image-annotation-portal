require('dotenv').config();
const express = require("express");

const passport = require("passport");
const initializePassport = require("./passport-config.js");
const functionLibrary = require("./function-library.js");
const variables = require("./variables.js");
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");

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
app.use(express.static(path.join(__dirname,'/public')));

app.use(authRoutes);
app.use(adminRoutes);
app.use(userRoutes);
app.use(apiRoutes);

initializePassport(passport);
functionLibrary.initializeMulter();
functionLibrary.populateImageList(variables.currentImagesDB);

app.get("/",functionLibrary.checkAuthenticated,(req,res)=>{
    if((req.session.passport.user.userType).includes("user")) res.redirect("/user");
    else res.redirect("/admin");
});const bcrypt = require("bcrypt");

app.get("*",(req,res)=>{
    res.redirect("/");
})
const port = process.env.PORT || 4000 ;
app.listen(port);