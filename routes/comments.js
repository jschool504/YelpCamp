var express     = require("express");
var router      = express.Router({mergeParams: true});

var Campground  = require("../models/campground.js");
var Comment     = require("../models/comment.js");

// COMMENTS ROUTES

router.get("/new", isLoggedIn, function(request, response) {
	Campground.findById(request.params.id, function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			response.render("comments/new", {campground: foundCampground});
		}
	});
});

// Create Comment

router.post("/", isLoggedIn, function(request, response) {
	Campground.findById(request.params.id, function(error, campground) {
		if (error) {
			console.log(error);
		} else {
			Comment.create(request.body.comment,  function(error, comment) {
				if(error) {
					console.log(error);
				} else {
				    // add username and id to comment
				    comment.author.id = request.user._id;
				    comment.author.username = request.user.username;
				    console.log("New comment's username will be: " + request.user.username);
				    //save comment
				    comment.save();
					campground.comments.push(comment)
					campground.save();
					response.redirect("/campgrounds/" + campground.id);
				}
			});
		}
	})
});

function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	
	response.redirect("/login");
}

module.exports = router;