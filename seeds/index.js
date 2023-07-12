// Loading environment variables from .env file in development mode
if(process.env.NODE_ENV!=="production")
{
    require('dotenv').config();
}

// Requiring important variables
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, descriptions } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');

// Connect to the MongoDB database using the provided DB_URL in environment variables
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

// Event listeners for database connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // Delete all existing campgrounds in the database
  await Campground.deleteMany({});

  // Loop to create new campgrounds
  for (let i = 0; i < 150; i++) {
    const random1000 = Math.floor(Math.random() * 120);
    const price = Math.floor(Math.random() * 100);
    let thumbnailImageUrl;
    
    // Fetch a random image from the Unsplash API
    await new Promise((resolve, reject) => {
      axios.get(process.env.UNSPLASH_API)
        .then(response => {
          const data = response.data;
          const randomIndex = Math.floor(Math.random() * data.length);
          thumbnailImageUrl = data[randomIndex].urls.small;
          resolve();
        })
        .catch(error => {
          console.error('Error fetching image:', error);
          reject();
        });
    });

    // Create a new campground document with randomly generated data
    const camp = new Campground({
      author:process.env.MAIN_USERID, // Set the author to the provided MAIN_USERID in environment variables
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: `${sample(descriptions)}`,
      price,
      geometry:{
          type:"Point",
          coordinates:[cities[random1000].longitude,cities[random1000].latitude]
      },
      images:[{
          url:thumbnailImageUrl,
          filename:'TravelCamp/Unsplash'
      }]
    });
    await camp.save(); // Save the campground document to the database
  }
};

// Call the seedDB function to seed the database
seedDB()
.then(() => {
  mongoose.connection.close(); // Close the database connection after seeding
})
.catch(error => {
  console.error('Seed error:', error);
});
