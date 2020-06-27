const express = require("express");
let router = express.Router();
const functionLibrary = require("../function-library");
const passport = require("passport");
const bcrypt = require("bcrypt");

router.get("/login",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('login.ejs',{session:req.session});
});

router.get("/login/user",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('loginUser.ejs');
});

router.get("/login/admin",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('loginAdmin.ejs');
});

router.get("/register",functionLibrary.checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs',{ session: req.session });
});

router.post('/login/admin',functionLibrary.checkNotAuthenticated,functionLibrary.addUserTypeAdmin, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login/admin',
    failureFlash: true
}))

router.post('/login/user',functionLibrary.checkNotAuthenticated, functionLibrary.addUserTypeUser,passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login/user',
    failureFlash: true
}))

router.delete('/logout',functionLibrary.checkAuthenticated,(req,res)=>{
    req.logOut();
    res.redirect('/login');
});

router.post("/register",functionLibrary.checkNotAuthenticated,async (req,res)=>{
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

module.exports = router;