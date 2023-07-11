const express=require('express');
const router=express.Router({mergeParams:true});
const { storeReturnTo } = require('../middleware');
const passport=require('passport');
const wrapasync=require('../utils/wrapsync');
const users = require('../controllers/users');

router.route('/register').get(users.renderRegister
    ).post(wrapasync(users.newRegister))

router.route('/login').get(users.renderLogin).post(storeReturnTo,
passport.authenticate('local',{failureRedirect:'/register',failureMessage: true}),users.Login)

router.get('/logout',users.Logout); 

module.exports=router;