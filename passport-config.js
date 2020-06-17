const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const functionLibrary = require("./function-library");
const getUserByEmail = functionLibrary.getUserByEmail;
const getUserById = functionLibrary.getUserById;

let email = "sshmhr@gmail.com";
const variables = require("./variables.js");

const authenticateUser = async (email,password,done)=>{
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
}

function initialize(passport){
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user,done)=>done(null,user.id));
    passport.deserializeUser((id,done)=>done(null,getUserById(id)));
}

module.exports = initialize;