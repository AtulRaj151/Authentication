const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
//tell passport to use new login using google
passport.use(new googleStrategy({
     clientID:"572077752394-jq4n8l3rlf785re7lkhla917oad23ik4.apps.googleusercontent.com",
     clientSecret:"Lxl1Z0G7dXwk6s_5CNJ5vZsC",
     callbackURL:"http://localhost:8000/users/auth/google/callback"
},
function(accessToken,refreshToken, profile, done) {
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
               if(err){console.log("error in google strategy passport",err); return;}
                console.log(profile);

                if(user) {

                    //if user is found set this as req.user
                    return done(null,user);
                }else{

                    //if not found create user and set it as req.user
                    User.create({
                         name:profile.displayName,
                         email:profile.emails[0].value,
                         password:crypto.randomBytes(20).toString('hex')
                    },function(err,user){
                        if(err){console.log("error in user strategy passport",err); return;}
                        return done(null,user);
                    })
                }
        })
}
))