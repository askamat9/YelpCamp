const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {
    checkCampgroundOwner: function(req, res, next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, campground){
                if(err){
                    req.flash("error", "Campground not found");
                    res.redirect("back");
                } else {
                    if (!campground) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    if(campground.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "permission denied");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "please login first");
            res.redirect("back");
        }
    },
    checkCommentOwner: function(req, res, next){
        if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, comment){
                if(err){
                    req.flash("error", "comment not found");
                    res.redirect("back");
                } else {
                    if (!comment) {
                        req.flash("error", "Item not found.");
                        return res.redirect("back");
                    }
                    if(comment.author.id.equals(req.user._id)){
                        next();
                    } else {
                        req.flash("error", "permission denied");
                        res.redirect("back");
                    }
                }
            });
        } else {
            req.flash("error", "please login first");
            res.redirect("back");
        }
    },
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "please login first");
        res.redirect("/login");
    }
};

module.exports = middlewareObj;