const Campground=require('../models/campground');

// Importing the Mapbox Geocoding service,
// which functionality for geocoding and reverse geocoding, 
// converting addresses to coordinates and vice versa.
const mbxgeocoding=require('@mapbox/mapbox-sdk/services/geocoding')
const mbxtoken=process.env.MAPBOX_TOKEN;

// geocoder object can be used to perform geocoding and reverse geocoding operations.
const geocoder=mbxgeocoding({accessToken:mbxtoken})

// The cloudinary object provides access to various methods for 
// working with Cloudinary services, such as uploading and managing images.
const { cloudinary } = require("../cloudinary");


// Render the index page with all campgrounds
module.exports.index=async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds})
}

// Render the new campground form
module.exports.renderNewForm=(req,res)=>{
    if(!req.isAuthenticated())
    {
        req.flash('error','You must be signed in!')
        return res.redirect('/login')
    }
    res.render('campgrounds/new');
}

// Create a new campground
module.exports.createCampground=async(req,res,next)=>{
    const geoData=await geocoder.forwardGeocode({
          query:req.body.campground.location,
          limit:1
    }).send()
    
    const campground=new Campground(req.body.campground);
    campground.geometry=geoData.body.features[0].geometry;
    campground.images=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.author=req.user._id;
    await campground.save();
    // console.log(geoData.body.features[0]);
    req.flash('success','Successfully made a new campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

// Show a specific campground
module.exports.showCampground=async(req,res)=>{
    const campground=await Campground.findById(req.params.id).populate(
        {path:'reviews',
        populate:{
          path:'author'
        }}).populate('author');
    if(!campground)
    {
        req.flash('error','cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{campground})
}

// Render the edit campground form
module.exports.renderEditForm=async(req,res)=>{
    const{id}=req.params;
    const campground = await Campground.findById(id)
    if(!campground)
    {
        req.flash('error','Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit',{campground});
}

// Update a campground
module.exports.editCampground=async(req,res)=>{
    const{id}=req.params;
    const campground=await Campground.findByIdAndUpdate(id,{...req.body.campground});
    console.log(req.body);
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}));
    campground.images.push(...imgs);
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated the campground!')
    res.redirect(`/campgrounds/${campground._id}`)
}

// Delete a campground
module.exports.deleteCampground=async(req,res)=>{
    const{id}=req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted the campground!')
    res.redirect('/campgrounds');
}