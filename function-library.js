const variables = require("./variables.js");
const assert = require('assert');
const MongoClient =  require('mongodb').MongoClient;
const client = MongoClient(variables.url);
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

let initializeMulter = ()=>{

    const storage = multer.memoryStorage();
    let upload = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                return callback(new Error('Only images are allowed'))
            }
            callback(null, true)
        },
        limits:{
            fileSize: 1024 * 1024
        },
        onError : function(err, next) {
            console.log(error)
          }
    });
    variables.storage = storage;
    variables.upload = upload;
}

let addImageToDB = async (req,res) => {
    const client = await MongoClient.connect(variables.url);
    const db = client.db(variables.database);

    const user = req.session.passport.user.email;
    const question =  req.body.question;
    let imageList = []
    req.files.forEach((file)=>{
        const images = file.buffer;
        const encoded_image = images.toString('base64');
        let data = {}

        let finalImage = {
            contentType: file.mimetype,
            image: encoded_image,
            name: file.originalname
        }
        data.image = finalImage;
        data.question = question;
        data.user = user;
        imageList.push(data);
    });
    if(imageList.length==0) throw("no Image Selected");
    await db.collection('currentImagesTest').insertMany(imageList);
    client.close();

}

let storeData = async (hashedPassword,req)=>{

    let data = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                userType: req.body.userType
            };
    await insertIntoDatabase(req.body.userType,data);
}



let insertIntoDatabase = async (userType,data)=>{
    const client = await MongoClient.connect(variables.url);
    db = client.db(variables.database);
    await db.collection(userType).insertOne(data);
    client.close();
}


const getUserByEmail = async (userType,userEmail)=>{
    const client = await MongoClient.connect(variables.url);
    const db = client.db(variables.database);
    const query = { email: userEmail};
    const col = db.collection(userType).find(query);
    const res =  await col.toArray();
    client.close();
    return res[0];
}

let checkAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}

let checkNotAuthenticated = (req,res,next) => {
    if(!req.isAuthenticated()) return next();
    let url = "/";
    if((req.session.passport.user.userType).includes("user")) url = "/user"
    else url = "/admin"
    res.redirect(url);
}

let isAdmin = (req,res,next)=>{
    if((req.session.passport.user.userType).includes("admin")) return next();
    res.redirect("/user");
}

let isUser = (req,res,next)=>{
    if((req.session.passport.user.userType).includes("user")) return next();
    res.redirect("/admin");
}


let addUserTypeAdmin = (req,res,next) => {
    req.body.userType = "adminTest";
    return next();
}

let addUserTypeUser = (req,res,next) => {
    req.body.userType = "userTest";
    return next();
}

returnValue = {};
returnValue.storeData = storeData;
returnValue.getUserByEmail = getUserByEmail ;
returnValue.checkAuthenticated = checkAuthenticated ;
returnValue.checkNotAuthenticated = checkNotAuthenticated ;
returnValue.addUserTypeUser = addUserTypeUser ;
returnValue.addUserTypeAdmin = addUserTypeAdmin ;
returnValue.isAdmin = isAdmin;
returnValue.isUser = isUser;
returnValue.initializeMulter = initializeMulter;
returnValue.addImageToDB = addImageToDB;
module.exports = returnValue;