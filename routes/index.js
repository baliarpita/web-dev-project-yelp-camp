var express = require("express");
var router = express.Router();
var passport = require("passport");
var User  = require("../models/User");

// Landing page
router.get("/", function(req, res){
   res.render("landing"); 
});

// Show register form
router.get("/register", function(req, res){
   res.render("register"); 
});

// Register user
router.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
       if(err){
           req.flash("error", err.message);
           return res.redirect("/register");
       } 
       passport.authenticate("local")(req, res, function(){
            req.flash("success", "Successfully signed up as " + user.username);
        res.redirect("/campgrounds");
       });
    });
});

// Show login form
router.get("/login", function(req, res){
   res.render("login"); 
});

// Login user
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash: "Invalid login credentials. Please try with correct username/password.",
    successFlash: "Welcome!"
}), function(req, res){
});

// Logout user
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/campgrounds");
});

module.exports = router;