const User = require('../models/user');
const bcrypt = require('bcrypt');
const resetP = require('../mailers/reset_password');
//for json web tokens
const jwt = require('jsonwebtoken');
const jwtSimple = require('jwt-simple');
//for sending request for captcha
const request = require('request');



module.exports.profile = function(req,res) {

      return res.render('user_profile',{
          title:"user profile"
      })
}

module.exports.signUp = function(req,res){
//    if user is authenticated go to the profilegit 
    if(req.isAuthenticated()){

        return res.redirect('/users/profile');
     }

   return res.render('user_sign_up',{
           title:"Sign UP"
   })
  
}


module.exports.signIn = function(req,res){

    //if user is already authenticated to go to the profile page
    if(req.isAuthenticated()){

        return res.redirect('/users/profile');
     }

     //else go to the sign in page

     return res.render('user_sign_in',{
           title:"Sign In"
     })
}
//for sign up
module.exports.create = async function(req,res){
  
    if(req.body.password != req.body.confirm_password){
        req.flash('error',"Password Not Matched");
       return res.redirect('back');
    }



   let user  = await User.findOne({email: req.body.email});

     
            if(!user){

                        
                //  bcrypt.hash(req.body.password, 10, function(err, hash) {
                //     // Store hash in your password DB.
                //     if(err){console.log('err in hash passowrd',err)}
                //      console.log(hash)
                //     return hash;
                // });
                  //convert the plain text password to the hash password
                bcrypt.hash(req.body.password, 10).then(function(hash) {

                    const captcha  = req.body['g-recaptcha-response']  // fetching the recaptcha response

                    //if captcha not  ticked then error
                    if(captcha === undefined ||
                       captcha == ''
                       || captcha == null){
                           req.logout();
                            console.log(captcha)
                                
                           req.flash('error',"Verify Captcha!!!!");
                          
               
                            return res.redirect('back')
                       }
                            //secret Key
                            const secretKey = '6Le5D6sZAAAAAHcMYrcdLLcZs7bHU8pY1MKKNp42';
               
                            //verifyKey 
                             const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}
                             &response=${captcha}&remoteip${req.connection.remoteAddress}`;
                         //make request to verify url
               
                         request(verifyUrl,(err,response,body)=>{
               
                             body = JSON.parse(body);
               
                             if(body.success!=undefined && !body.success){
                                  req.logout();
                                  req.flash('error',"Incorrect");
                               return res.redirect('back');
                             }
               
                             //if Successfull
                             User.create({
                                email:req.body.email,
                                password:hash,
                                name:req.body.name
                                 
                           });
                           req.flash('success',"Now Login");
                           return res.redirect('/users/sign-in');
                         })
                 
                 
                }).catch((err)=>{
                     console.log(err);
                })
                
  
               
               

            }else{
                req.flash('error',"User Already Exists");
                return res.redirect('back');
            }

}

module.exports.createSession = function(req,res){
    // console.log('In createSession'   

    //creating verification for recaptcha
     const captcha  = req.body['g-recaptcha-response']  // fetching the recaptcha response

     //if captcha not  ticked then error
     if(captcha === undefined ||
        captcha == ''
        || captcha == null){
            req.logout();
             console.log(captcha)
                 
            req.flash('error',"Verify Captcha!!!!");
           

             return res.redirect('back')
        }
             //secret Key
             const secretKey = '6Le5D6sZAAAAAHcMYrcdLLcZs7bHU8pY1MKKNp42';

             //verifyKey 
              const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}
              &response=${captcha}&remoteip${req.connection.remoteAddress}`;
          //make request to verify url

          request(verifyUrl,(err,response,body)=>{

              body = JSON.parse(body);

              if(body.success!=undefined && !body.success){
                   req.logout();
                   req.flash('error',"Incorrect");
                return res.redirect('back');
              }

              //if Successfull

              req.flash('success',"logged in Successfully");
              return res.redirect('/');
          })

 
}

module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success',"You have logged out");
 return res.redirect('/');
}

module.exports.resetPassword = function(req,res) {
      
    return res.render('user_reset_password');
}

module.exports.update = async function(req,res) {

      

        if(req.user.id == req.params.id) {
            if(req.body.password != req.body.confirm_password){
                req.flash('error',"Password not Matched");
                return res.redirect('back');
            }

              
         let user  = await User.findById(req.params.id);
         //check old password password

         bcrypt.compare(req.body.old_password, user.password).then(function(result) {
            // result == true

               //update password
                 if(result){
                        bcrypt.hash(req.body.password, 10).then(function(hash) {
                                console.log(req.body.password);
                           User.findByIdAndUpdate(req.params.id,{password:hash},function(err,user){

                           });
                           req.flash('success',"Password Updated");
                            return res.redirect('/users/profile');
                       
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }else{
                        req.flash('error',"Old Password not Matched");
                        return res.redirect('back');
                    }
   
        }).catch((err) =>{
              
            return res.redirect('back');
        });

   }else{
       return res.redirect('back');
   }

}

//forgot password

module.exports.forgotPassword = function(req,res){
     
      return res.render('forgot');
}
//generating reset link
module.exports.resetLink = function(req,res){

       const email = req.body.email;
       User
       .findOne({email:email})
       .then((user) =>{
            if(!user){
                  console.log("no user present");
                  return;
            }
            let token = jwt.sign(user.toJSON(),'codingninja',{expiresIn:'20000'});

          resetP.resetPassword(user,token);
          req.flash('success',"Reset Link has been sent to your Mail");

          return res.redirect('/users/profile');
          
       })
   
       .catch((err) =>{
            console.log("Error in sending mails1")
       })

}
//reciveing reset link  from user

module.exports.setPassword = function(req,res) {

    const {user_id,token} = req.params;

    User.findOne({user_id})
    .then((user) => {
         
        const secret = 'codingninja';
       
         try{

              let decode = jwtSimple.decode(token,secret); //decoding the user using jwt simple
              return res.render('user_forgot_password',{
                  decode:decode
              });

         }catch(err){
                 console.log("error expired");
                 req.flash('error',"Session Expired");
                 req.flash('error'," Reset Again");
                 return res.redirect('/users/forgot-password');
         }
       
        // console.log(x.iat - x.exp);
        // console.log("payload is",payload);
        return res.redirect('back');
    })


}

module.exports.setForgottonNewPassword = function(req,res){

       
      
    if(req.body.password != req.body.confirm_password){

        return res.redirect('back');
     }

              bcrypt.hash(req.body.password, 10).then(function(hash) {
                        console.log(req.body.password);
                User.findByIdAndUpdate(req.params.id,{password:hash},function(err,user){

                });
                    console.log("password updateed");
                    return res.redirect('/users/profile');

                }).catch((err)=>{
                    console.log(err);
                })
                



}


