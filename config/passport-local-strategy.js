const passport = require('passport');
const bcrypt = require('bcrypt');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

console.log("in passport local");
// authentication using passport
passport.use(new LocalStrategy({
        passReqToCallback:true,
        usernameField: 'email'
    },
    function(req,email, password, done){
        // find a user and establish the identity
        console.log("found user");
        User.findOne({email: email}, function(err, user)  {
            if (err){
                // console.log('Error in finding user --> Passport');
                req.flash('error',err);
                return done(err);
            }

              // find the hash password from the db and check with current password
            bcrypt.compare(password, user.password).then(function(result) {
                // result == true

                if (!user || result==false){
                    // console.log('Invalid Username/Password');
                    req.flash('error','Invalid User/Password');
                    return done(null, false);
                }
                  
            console.log("found user")

            return done(null, user);
            }).catch((err) =>{
                  
                return done(null,false);
            });

          
        });
    }


));


// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err){
            console.log('Error in finding user --> Passport');
            return done(err);
        }

        return done(null, user);
    });
});
//check if the user is signed in , then pass on the requst to the next function(controller's action)
passport.checkAuthentication = function(req,res,next){
        if(req.isAuthenticated()){

            return next();
        }
        //if the user isnot signed in
        return res.redirect('/users/sign-in');

}
passport.setAuthenticatedUser = function(req,res,next){

        if(req.isAuthenticated()){

            //req.user has current signed in user from the session cookie and set to locals for views
             res.locals.user = req.user; //
             
        }
        next();
     
}

module.exports = passport;