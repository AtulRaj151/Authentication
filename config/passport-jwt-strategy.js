const passport = require('passport');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const User = require('../models/user');

let opts = {

      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey:'codingninja',

}

passport.use(new JWTstrategy(opts,function(JwtPayLoad,done){

       User.findById(JwtPayLoad._id,function(err,user){

          if(err){ console.log("error in finding user using jwt",err); return ;}

           if(user){

              return done(null,user);
           }else{
               return done(null,false);
           }

       });

}));

module.exports = passport;

