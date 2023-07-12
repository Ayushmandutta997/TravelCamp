const mongoose=require('mongoose');
const Review=require('./review');

// Schema object from Mongoose
const Schema=mongoose.Schema;

// opts is set to { toJSON: { virtuals: true } }. 
// The toJSON option specifies that virtual properties should be included 
// when converting the schema instance to JSON format.
const opts={toJSON:{virtuals:true}};

// Defining the Campground Schema
const CampgroundSchema=new Schema({
    title: String,
    price: Number,
    images: [{
        url:String,
        filename:String
    }
    ],
    geometry: {
        type: {
          type: String, 
          enum: ['Point'], 
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    description: String,
    location: String,
    author:{
     type: Schema.Types.ObjectId,
     ref:'User'
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts);

// Defining a virtual property for the Campground schema
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p style="color:black;">${this.description.substring(0,40)}...</p>`
})

// Defining a post middleware to delete associated reviews when a campground is deleted
CampgroundSchema.post('findOneAndDelete',async function(doc){
   if(doc)
   {
     await Review.deleteMany({
        _id:{
            $in:doc.reviews
        }
     })
   }
})
module.exports = mongoose.model('Campground',
CampgroundSchema);