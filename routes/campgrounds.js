const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware");

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            if (!allCampgrounds) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render("campgrounds/index", {campgrounds:allCampgrounds});
        }
    });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new.ejs");
});

router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, found){
        if(err){
            console.log(err);
        } else {
            if (!found) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.render("campgrounds/show", {campground: found});
        }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
    const name = req.body.name;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name: name, image: image, description: desc, author: author};
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            if (!newlyCreated) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.redirect("campgrounds");
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwner, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (!campground) {
            req.flash("error", "Item not found.");
            return res.redirect("back");
        }
        res.render("campgrounds/edit", {campground: campground});
    });
});

router.put("/:id", function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            if (!campground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:id", function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            if (!campground) {
                req.flash("error", "Item not found.");
                return res.redirect("back");
            }
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;