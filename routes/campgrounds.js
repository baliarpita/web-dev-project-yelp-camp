var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

// Show all campgrounds
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
         if(err){
             console.log(err);
         }
        else{
            res.render("campgrounds/index", {campGrounds : campgrounds});
        }
    }); 
});

// Route to add a new campground
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.campgroundName;
    var image = req.body.campgroundImage;
    var description = req.body.campgroundDesc;
    var price = req.body.campgroundPrice;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampGround = {name: name, image: image, description: description, author: author, price: price};
    Campground.create(newCampGround,
    function(err, campground){
       if(err){
             console.log("Error");
         }
    });
    res.redirect("/campgrounds");
});

// Show form to add a new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
});

// Show a campground information
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Edit campground. Show edit form
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {

          Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    req.flash("error", "Campground not found");
                    return  res.render("campgrounds/index");
                }
                res.render("campgrounds/edit", {campground: foundCampground}); 
            });
});

// Update campground. Show updated campground
router.put("/:id", middleware.isLoggedIn, function(req, res) {
    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            req.flash("error", "Something went wrong.. Could not update campground!");
            return res.render("back");
        }
        req.flash("success", "Campground updated!");
        res.redirect("/campgrounds/"+ req.params.id); 
    });
   
});

// Destroy campground
router.delete("/:id", middleware.isLoggedIn, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            return res.redirect("/campgrounds");
        }
        res.redirect("/campgrounds");
    });
});

module.exports = router;