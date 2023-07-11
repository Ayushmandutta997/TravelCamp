if(process.env.NODE_ENV!=="production")
{
    require('dotenv').config();
}
const express = require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash = require('connect-flash');
const methodOverride=require('method-override');
const passport=require('passport');
const User=require('./models/user')
const ExpressError = require('./utils/ExpressError');
const dburl=process.env.DB_URL || 'mongodb://0.0.0.0:27017/travel-camp';
const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users')
const mongoSanitize = require('express-mongo-sanitize');
const helmet=require('helmet');
const MongoDBStore = require('connect-mongo');
mongoose.connect(dburl);
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
});
const app=express();
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))
app.use(
  mongoSanitize({
    replaceWith: '_',
  }),
);
app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://api.unsplash.com/",
    "https://ajax.googleapis.com/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://api.unsplash.com/",
    "https://cdn.jsdelivr.net/",
    "https://ajax.googleapis.com/"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://api.unsplash.com/",
    "https://cdn.jsdelivr.net/",
    "https://ajax.googleapis.com/"
];
const fontSrcUrls = [
    "https://cdn.jsdelivr.net/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'","'unsafe-eval'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'","'unsafe-eval'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dahy7kdux/", 
                "https://images.unsplash.com/",
                "https://api.unsplash.com/",
                "https://cdn.jsdelivr.net/",
                "https://moustachescapes.com/",
                "https://campmonk.com/",
                "https://images.alphacoders.com/",
                "https://rare-gallery.com/",
                "https://images.pexels.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
const secret=process.env.SECRET
const store = MongoDBStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
});
store.on("error",function(e){
    console.log("SESSION STORE ERROR",e)
})
const sessionConfig={
    store,
    name:'project1',
    secret: process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+ 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)
app.get('/',(req,res)=>{
    res.render('home');
});


app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404))
})
app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message='oh no,Something went wrong'
    res.status(statusCode).render('error',{err})
})
app.listen(3000,()=>{
    console.log('Serving on port 3000');
})