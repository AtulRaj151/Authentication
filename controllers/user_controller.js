const User = require('../models/user');
const bcrypt = require('bcrypt');


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
                 
                    User.create({
                        email:req.body.email,
                        password:hash,
                        name:req.body.name
                         
                   });
                   return res.redirect('/users/sign-in');
                }).catch((err)=>{
                     console.log(err);
                })
                
  
               
               

            }else{
                return res.redirect('back');
            }

}

module.exports.createSession = function(req,res){
    // console.log('In createSession')
    // req.flash('success',"logged uiin successfully");
   return res.redirect('/');
}

module.exports.destroySession = function(req,res){
    req.logout();
    // req.flash('success',"You have logged out");
 return res.redirect('/');
}

module.exports.resetPassword = function(req,res) {
      
    return res.render('user_reset_password');
}

module.exports.update = async function(req,res) {

      

        if(req.user.id == req.params.id) {
            if(req.body.password != req.body.confirm_password){
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
                            console.log("password updateed");
                            return res.redirect('/users/profile');
                       
                        }).catch((err)=>{
                            console.log(err);
                        })
                    }else{
                        return res.redirect('back');
                    }
   
        }).catch((err) =>{
              
            return res.redirect('back');
        });

   }else{
       return res.redirect('back');
   }

}