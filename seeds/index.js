if(process.env.NODE_ENV!=="production")
{
    require('dotenv').config();
}
const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors, descriptions } = require('./seedHelpers');
const Campground = require('../models/campground');
const axios = require('axios');
mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 150; i++) {
      const random1000 = Math.floor(Math.random() * 120);
      const price = Math.floor(Math.random() * 100);
      let thumbnailImageUrl;
  
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
      const camp = new Campground({
        author:process.env.MAIN_USERID,
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
      await camp.save();
    }
  };
  
  seedDB()
    .then(() => {
      mongoose.connection.close();
    })
    .catch(error => {
      console.error('Seed error:', error);
    });
  