const express = require('express');
const  router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user_controller');
//getting sign in and signup routes
router.get('/sign-in',userController.signIn);
router.get('/sign-up',userController.signUp);
router.get('/profile',passport.checkAuthentication,userController.profile)
// post reques  of sign-in and signup
router.post('/create',userController.create);

router.post('/create-session',passport.authenticate(
    'local', // strategy is local authentication
    {failureRedirect:'/users/sign-in'} // if session fails 
),userController.createSession); //middleware passport.authenticate

router.get('/sign-out',userController.destroySession);//logout session
router.get('/reset-password',userController.resetPassword); //reset password
router.post('/update-password/:id',userController.update);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/sign-in'}),userController.createSession);



module.exports = router;