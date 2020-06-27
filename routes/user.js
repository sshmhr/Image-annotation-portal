const express = require("express");
let router = express.Router();
const functionLibrary = require("../function-library");
const variables = require("../variables");

router.post("/next",(req,res)=>{
    req.session.imageIndex++;
    res.redirect("/user");
})

router.post("/previous",(req,res)=>{
    req.session.imageIndex--;
    res.redirect("/user");
})

router.get("/user",functionLibrary.checkAuthenticated,functionLibrary.isUser,(req,res)=>{
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


router.post("/imageAnnotated",async (req,res)=>{
    await functionLibrary.transferData(variables.currentImagesDB,req);
    res.redirect("/user");
})

module.exports = router;