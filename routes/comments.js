var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment  = require("../models/comment");
var middleware = require("../middleware/index.js");

// Show form to add a new comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
             res.render("comments/new", {campground: campground});
        }
    });
});

// Route to add a new comment
router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
       if(err){
           console.log(err);
            res.redirect("/campgrounds/" + foundCampground._id);
       } else{
          Comment.create(req.body.comment, function(err, addedComment){
               if(err){
                   console.log(err);
                    res.redirect("/campgrounds/" + foundCampground._id);
               } else{
                   addedComment.author.id = req.user._id;
                   addedComment.author.username = req.user.username;
                   addedComment.save();
                   foundCampground.comments.push(addedComment);
                   foundCampground.save();
                   req.flash("success", "Comment added successfully!");
                   res.redirect("/campgrounds/" + foundCampground._id);
               }
          });
       }
    });
});

router.get("/:comm_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comm_id, function(err, foundComment){
       if(err){
           res.redirect("back");
       } else{
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});   
       }
    });
});

router.put("/:comm_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comm_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        } else{
            req.flash("success", "Comment updated successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
}); 

router.delete("/:comm_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comm_id, function(err){
        if(err){
            res.render("back");
        } else{
            req.flash("success", "Comment deleted successfully!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;