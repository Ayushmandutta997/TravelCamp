const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');

// Defining the User schema
const UserSchema=new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
});

//  This plugin simplifies the integration of Passport.js with Mongoose
//  by adding username and password fields to the schema and providing 
// additional methods for authentication and user management.
UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model('User',UserSchema);
