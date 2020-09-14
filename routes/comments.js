const express = require("express");
const router = express.Router({mergeParams:true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            if (!campground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render("comments/new", {campground: campground});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/camgrounds/" + campground._id + "/comments/new")
        } else {
            if (!campground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    if (!comment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/"+ campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            if (!comment) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
        }
    });
});

router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            if (!comment) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            if (!comment) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;