const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js"); // Import the Review model

// Rest of your code...


const validateListing = (req, res, next) => {
    let { error } = listingSchemea.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }   else {
        next();
    }
};
  
const reviewController = require("../controllers/reviews.js");

//Reviews
//Post route
router.post(
  "/",
  wrapAsync (reviewController.createReview)
  );
 
 router.delete("/:reviewId", wrapAsync(reviewController.destroyReview)
 );
 
 module.exports = router;