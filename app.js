 if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
 }
 

 console.log(process.env.SECRET);
const express = require("express");
const app = express();
const mongoose = require("mongoose");
 const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
 const ExpressError = require("./utils/ExpressError.js");
 const session = require("express-session");
 const MongoStore = require("connect-mongo");
 const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
 const User = require("./models/user.js");

const lisingsRouter=require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");




// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600
});
store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});
const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,  
  cookie: {
    httpOnly: true,
  secure: false,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};  

app.use(session(sessionOptions));
app.use(flash());
 app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req,res,next)=>{
  console.log("👉 ROUTE HIT:", req.method, req.originalUrl);
  next();
});


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  
  next();
});

app.use("/",userRouter);
app.use("/listings",lisingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);





// app.get("/demouser", async (req, res) => {
//   let fakeuser=new User({username:"demouser",
//     email:"bHf2o@example.com"});
//   let newUser=await User.register(fakeuser,"helloworld");
//     res.send(newUser);  
// });

// app.use("/listings",lisingsRouter);
// app.use("/listings/:id/reviews",reviewsRouter);

//  app.get("/", (req, res) => {
//   res.send("Working the route");
// });
// app.all(/.*/, (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found"));
// });





// app.use((err, req, res, next) => {
//   let { statusCode = 500, message = "Somethings went wrong" } = err;
//   res.status(statusCode).render("error.ejs", { message });
//   // res.status(statusCode).send(message);
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somethings went wrong" } = err;
  return res.status(statusCode).render("error.ejs", { message });
});


app.listen(8080, () => {
  console.log("server is running on port 8080");
});
