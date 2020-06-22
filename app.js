require('dotenv').config();
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
app.use(express.static(path.join(__dirname,'/public')));

initializePassport(passport);
functionLibrary.initializeMulter();
functionLibrary.populateImageList(variables.currentImagesDB);

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
    res.render('login.ejs',{session:req.session});
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

app.post("/next",(req,res)=>{
    req.session.imageIndex++;
    res.redirect("/user");
})

app.post("/previous",(req,res)=>{
    req.session.imageIndex--;
    res.redirect("/user");
})

app.get("/user",functionLibrary.checkAuthenticated,functionLibrary.isUser,(req,res)=>{
    if(!req.session.imageIndex)req.session.imageIndex = 0 ;
    req.session.showNext = true;
    req.session.showPrevious = true;

    if(req.session.imageIndex>=variables.images.length-1){
        req.session.imageIndex = variables.images.length - 1 ;

        req.session.showNext = false;
    }

    if(req.session.imageIndex<=0){
        req.session.imageIndex = 0 ;
        req.session.showPrevious = false;
    }

    let image = variables.images[req.session.imageIndex];
    req.session.imageData = image ;
    res.render('user.ejs',
        {   name: req.user.name ,
            image: image ,
            componentToDisable: req.session.componentToDisable ,
            showNext: req.session.showNext ,
            showPrevious: req.session.showPrevious
        }
    );
});

app.get("/admin",functionLibrary.checkAuthenticated,functionLibrary.isAdmin,(req,res)=>{
    res.render('admin.ejs',{ name: req.user.name , session: req.session});
});

app.post("/imageAnnotated",async (req,res)=>{
    await functionLibrary.transferData(variables.currentImagesDB,req);
    res.redirect("/user");
})

app.post("/getAnnotatedDataWithImage",async (req,res)=>{
    let annotatedData = await functionLibrary.getAnnotatedData();
    res.send(annotatedData);
})

app.post("/getAnnotatedData",async (req,res)=>{
    let annotatedData = await functionLibrary.getAnnotatedData();
    annotatedData.forEach((ele)=>{
        delete ele.image.image;
    });
    res.send(annotatedData);
})

app.post("/register",functionLibrary.checkNotAuthenticated,async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10);
        existingUser = await functionLibrary.getUserByEmail(req.body.userType,req.body.email);
        if(existingUser!=undefined) throw "User with this email already exists";
        req.session.successMessage = "You have been registered successfully, Please login to begin"
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
const port = process.env.PORT || 4000 ;
app.listen(port);
