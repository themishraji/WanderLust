const Listing = require("../models/listing");
const ExpressError = require('../utils/ExpressError'); 

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("reviews")
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    console.error("Error fetching listing:", err);
    req.flash("error", "Failed to fetch listing!");
    res.redirect("/listings");
  }
};

  module.exports.createListing = async (req, res) => {
    try {
      const { title, description, price, location, country } = req.body.listing;
      const newListing = new Listing({
        title,
        description,
        price,
        location,
        country,
      });
      await newListing.save();
      req.flash("success", "Listing created successfully!");
      res.redirect("/listings");
    } catch (err) {
      console.error("Error creating listing:", err);
      req.flash("error", "Failed to create listing!");
      res.redirect("/listings/new");
    }
  };
  

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  };  

module.exports.updateListing = async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        res.redirect(`/listings/${id}`);
  };
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  };