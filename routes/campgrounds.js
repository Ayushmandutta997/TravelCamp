const express=require('express');
const router=express.Router({mergeParams:true});
const wrapasync=require('../utils/wrapsync'); 
const campgrounds=require('../controllers/campgrounds')
const {isLoggedIn,isAuthor,validateCampground}=require('../middleware')
const multer  = require('multer')
const {storage}=require('../cloudinary')
const upload = multer({storage});

router.route('/')
.get(wrapasync(campgrounds.index))
.post(isLoggedIn,upload.array('image'),validateCampground,wrapasync(campgrounds.createCampground))

router.get('/new',isLoggedIn,campgrounds.renderNewForm)

router.route('/:id').get(wrapasync(campgrounds.showCampground))
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,wrapasync(campgrounds.editCampground))
.delete(isLoggedIn,isAuthor,wrapasync(campgrounds.deleteCampground))

router.get('/:id/edit',isLoggedIn,isAuthor,wrapasync(campgrounds.renderEditForm))

module.exports = router;