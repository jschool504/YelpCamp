// middleware!!

var Campground  = require("../models/campground");
var Comment    = require("../models/comment");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(request, response, next) {
    if (request.isAuthenticated()) {
		return next();
	}
	request.flash("error", "Please login!");
	response.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(request, response, next) {
    if (request.isAuthenticated()) {
		Campground.findById(request.params.id, function(error, campground) {
			if (error) {
				response.redirect("/");
			} else {
				if (campground.author.id.equals(request.user.id)) {
					next();
				} else {
					response.redirect("/");
				}
			}
		});
	} else {
	    request.flash("error", "Please login as the owner of this campground!");
		response.redirect("/login");
	}
}

middlewareObj.checkCommentOwnership = function(request, response, next) {
    if (request.isAuthenticated()) {
        Comment.findById(request.params.comment_id, function(error, comment) {
            if (error) {
                response.redirect("/campgrounds/" + request.params.id);
            } else {
                if (comment.author.id.equals(request.user.id)) {
                    next();
                } else {
                    response.redirect("/campgrounds/" + request.params.id);
                }
            }
        });
    } else {
        request.flash("error", "Please login as the owner of this comment!");
        response.redirect("/login");
    }
}

module.exports = middlewareObj;