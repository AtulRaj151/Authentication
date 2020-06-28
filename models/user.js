const mongoose = require('mongoose');

//creating user schema
const userSchema = new mongoose.Schema({

    email: {

        type: String,
        required:true,
        unique:true
   },
   password: {

       type:String,
       required:true,
  },

  name: {

     type: String,
     required: true,

      },
},{
    timestamps:true
})

module.exports = mongoose.model('User',userSchema);