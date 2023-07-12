const mongoose=require('mongoose');
const Schema=mongoose.Schema;

// Creating the review schema
const reviewSchema=new Schema({
    body: String,
    rating:Number,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

// Exporting the review model
module.exports=mongoose.model("Review",reviewSchema);