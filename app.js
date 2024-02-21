const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require('express-session');
const flash = require('connect-flash');

// Import route handlers
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// MongoDB connection URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Define session options
const sessionOptions = {
  secret: 'your_secret_key_here', // Replace with your actual secret key
  resave: false,
  saveUninitialized: true
};

// Connect to MongoDB
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Initialize Express application
const app = express();

// Configure Express settings
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// Initialize session middleware
app.use(session(sessionOptions));

// Initialize flash middleware
app.use(flash());

// Initialize passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Configure passport to use LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Middleware to set locals
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!", errors } = err; // Extract errors object from err if available
  if (err.name === 'ValidationError') {
    // Handle Mongoose validation errors
    message = "Validation Error: " + Object.values(err.errors).map(error => error.message).join(', ');
  }
  res.status(statusCode).render("error", { message }); // Assuming error.ejs is your error template
});



// Define routes
app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

app.use("/", userRouter);
app.use("/listings", listingRouter); 
app.use("/listings/:id/reviews", reviewRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error", { message }); // Adjust rendering path
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
 