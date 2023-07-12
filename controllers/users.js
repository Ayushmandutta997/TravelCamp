const User=require('../models/user');

// Render the register form
module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}

// Handle user registration
module.exports.newRegister=async(req,res,next)=>{
    try{
    const {email,username,password}=req.body;
    const user=new User({email,username});
    const registeredUser= await User.register(user,password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Travel Camp!');
        res.redirect('/campgrounds');
    })
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}

// Render the login form
module.exports.renderLogin=(req,res)=>{
    res.render('users/login'); 
}

// Handle user login
module.exports.Login=(req,res)=>{
    req.flash('success',`Welcome Back ${req.user.username}!`)
    // Get the redirect URL from the request object or default to the campgrounds page
    const redirectUrl=res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
} 

// Get the redirect URL from the request object or default to the campgrounds page
module.exports.Logout=(req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', `Thanks for visiting!`);
        res.redirect('/campgrounds');
    });
} 