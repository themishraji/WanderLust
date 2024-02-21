const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport")
const path = require('path');
const { saveRedirectUrl } = require("../middleware.js");


const app = express();
const userController = require("../controllers/users.js");
const { render } = require("ejs");

// Define route to render signup page
router.get('/signup', userController.renderSignupForm );

router.post("/signup",
 wrapAsync(userController.signup)
); 


  router.get("/login", userController.renderLoginForm);

  router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", { 
    failureRedirect: '/login', 
    failureFlash: true,
   }),
   userController.login
   );

router.get("/logout", userController.logout);

module.exports = router;  