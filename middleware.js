// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to create a listing!");
  res.redirect("/login");
};


module.exports.saveRedirectUrl = (req, res, next) => {
   if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};