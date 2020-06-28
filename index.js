const express = require('express');
const port = 8000;
const app = express();
const cookieParser = require('cookie-parser');
const expressLayout = require('express-ejs-layouts');
//connection regarding the passport js
const db = require('./config/mongoose');
const session = require('express-session')  // require express session for creating session
const passport = require('passport')
const passportLocal = require('.//config/passport-local-strategy');



//use the static files in assets
app.use(express.static('./assets'));






// making the common layout
app.use(express.urlencoded());  //reading through the post requests
app.use(cookieParser()); // parsing the coookie
app.use(expressLayout);
app.set('layout extractStyles',true);//setting local css
app.set('layout extractScripts',true);//setting local js




//setting up view engine
app.set('view engine','ejs');
app.set('views','views');




//creating session
app.use(session({
       name: 'atul', // name of the cookie
       //TODO change the secret before deployment
       secret: 'codingNinjaTest3',
       saveUninitialized: false,
       resave:false,
       cookie:{
              maxAge: (1000*60*100)
       },
       // store: new MongoStore(
  
       //        {
       //             mongooseConnection:db,
       //             autoRemove: 'disabled'
       //        },
       //        function(err){
       //             console.log(err || 'connect to db');
       //        }
       // )
  
  }));
  
  app.use(passport.initialize());
  app.use(passport.session());

  app.use(passport.setAuthenticatedUser); //passing user to views

///setting the routes 
app.use('/',require('./routes'));

//listen to the required port
app.listen(port,function(err){
      
       if(err) {console.log("error",err); return;}

       console.log("Connected to the server");
})