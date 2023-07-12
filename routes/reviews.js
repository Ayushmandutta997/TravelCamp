const express=require('express');
const router=express.Router({mergeParams:true});
const wrapasync=require('../utils/wrapsync'); 
const reviews=require('../controllers/reviews')
const {isLoggedIn,validateReview,isReviewer }=require('../middleware')

// Defining routes for reviews
router.post('/',isLoggedIn,validateReview,wrapasync(reviews.createReview))

router.delete('/:reviewId',isLoggedIn,isReviewer,wrapasync(reviews.deleteReview))
module.exports=router;