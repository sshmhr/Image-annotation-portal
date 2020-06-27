const express = require("express");
let router = express.Router();
const functionLibrary = require("../function-library");


router.post("/getAnnotatedDataWithImage",async (req,res)=>{
    let annotatedData = await functionLibrary.getAnnotatedData();
    res.send(annotatedData);
})

router.post("/getAnnotatedData",async (req,res)=>{
    let annotatedData = await functionLibrary.getAnnotatedData();
    annotatedData.forEach((ele)=>{
        delete ele.image.image;
    });
    res.send(annotatedData);
})


module.exports = router;