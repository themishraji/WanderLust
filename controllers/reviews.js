const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview =  async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
 
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save();
 
 
    res.redirect(`/listings/${listing._id}`);
 };

 module.exports.destroyReview = async (req, res) => {
    try {
      const { id, reviewId } = req.params;
  
      // Find the review by its ID
      const review = await Review.findById(reviewId);
  
      // Update the listing to remove the review ID
      const updatedListing = await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  
      // Delete the review
      const deletedReview = await Review.findByIdAndDelete(reviewId);
  
      // Redirect back to the listing page
      res.redirect(`/listings/${id}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  };