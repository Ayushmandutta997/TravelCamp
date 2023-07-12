// Importing the cloudinary module, which provides functionality for interacting with the Cloudinary service.
const cloudinary = require('cloudinary').v2;

// Storage engine for Multer that allows to store uploaded files directly to Cloudinary.
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuring Cloudinary with account details
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Creating an instance of CloudinaryStorage with the configured Cloudinary object
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'TravelCamp',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

// Export the configured cloudinary and storage objects
module.exports = {
    cloudinary,
    storage
};
