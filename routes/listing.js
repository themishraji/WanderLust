const ExpressError = require('../utils/ExpressError'); 
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../middleware.js"); // Import isLoggedIn middleware
const Joi = require("joi"); // Import Joi
const listingController = require("../controllers/listings.js");

// Define the schema for listing
const listingSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().uri().required(),
  price: Joi.number().required(),
  country: Joi.string().required(),
  location: Joi.string().required(), // Added location property
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// router.route("/")
// .get(wrapAsync(listingController.index));
// post( isLoggedIn, listingController.createListing);

// Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);
// Show Route
router.get("/:id", listingController.showListing);
// Create Route
router.post("/", isLoggedIn, listingController.createListing);

// Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.renderEditForm));

// Update Route
router.put("/:id", isLoggedIn, validateListing, wrapAsync(listingController.updateListing));

// Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;
