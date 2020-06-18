const variables = require("./variables.js");
const assert = require('assert');
const MongoClient =  require('mongodb').MongoClient;
const client = MongoClient(variables.url);

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

// (async () => {
//     req  = {
//         body: {
//                 name: "ss",
//                 email: "em",
//                 userType: "random15"
//             }
//     }
//     console.log(req)
//     // storeData("password",req)
//     x = await getUserByEmail("random15","ema");
//     console.log(typeof x)
// })();


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
module.exports = returnValue;