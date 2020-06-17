const variables = require("./variables.js");

let storeData = (hashedPassword,req)=>{
    variables.users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
}

let getUserByEmail = (email)=>variables.users.find(user=>user.email==email);

let getUserById = (id) => variables.users.find(user=>user.id==id);

let checkAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()) return next();
    res.redirect("/login");
}

let checkNotAuthenticated = (req,res,next) => {
    if(!req.isAuthenticated()) return next();
    res.redirect("/");
}
returnValue = {};
returnValue.storeData = storeData;
returnValue.getUserByEmail = getUserByEmail ;
returnValue.getUserById = getUserById;
returnValue.checkAuthenticated = checkAuthenticated ;
returnValue.checkNotAuthenticated = checkNotAuthenticated ;
module.exports = returnValue;