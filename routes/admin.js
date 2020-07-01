const express = require("express");
let router = express.Router();
const functionLibrary = require("../function-library");
const variables = require("../variables");

router.get("/admin",functionLibrary.checkAuthenticated,functionLibrary.isAdmin,(req,res)=>{
    res.render('admin.ejs',{ name: req.user.name , session: req.session});
});


router.post("/upload",functionLibrary.checkAuthenticated,functionLibrary.isAdmin,async (req,res,next)=>{
    let upload = await variables.upload.array('files',15);
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

module.exports = router;