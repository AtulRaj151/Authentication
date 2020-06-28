module.exports.signUp = function(req,res){

   return res.render('user_sign_up',{
           title:"Sign UP"
   })
  
}


module.exports.signIn = function(req,res){

     return res.render('user_sign_in',{
           title:"Sign In"
     })
}