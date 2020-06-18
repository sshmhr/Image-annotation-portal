const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const functionLibrary = require("./function-library");
const getUserByEmail = functionLibrary.getUserByEmail;
const getUserById = functionLibrary.getUserById;
const variables = require("./variables.js");

const authenticateUser = async (req,email,password,done)=>{
    const user = await getUserByEmail(req.body.userType,email);
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
    passport.use(new LocalStrategy({ usernameField: 'email' , passReqToCallback: true}, authenticateUser));
    passport.serializeUser((user,done)=>{
      return done(null,{ email: user.email , userType: user.userType});
    });
    passport.deserializeUser(async (id,done)=>{
      const user = await getUserByEmail(id.userType,id.email);
      return done(null,user);
    });
}

module.exports = initialize;