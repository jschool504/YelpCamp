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

// EDIT

router.get("/:comment_id/edit", function(request, response) {
	Campground.findById(request.params.id, function(error, campground) {
		if(error) {
			console.log(error);
		} else {
			Comment.findById(request.params.comment_id, function(error, comment) {
				if (error) {
					console.log(error);
				} else if (comment.author.id.equals(request.user.id)) {
					response.render("comments/edit", {campground: campground, comment: comment});
				} else {
					response.send("Sorry bro that's not yours");
				}
			});
		}
	});
});

router.put("/:comment_id", isLoggedIn, function(request, response) {
	Comment.findById(request.params.comment_id, function(error, comment) {
		if (error) {
			console.log(error);
		} else if (comment.author.id.equals(request.user.id)) {
			Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function(error) {
				if (error) {
					console.log(error);
				} else {
					response.redirect("/campgrounds/" + request.params.id);
				}
			});
		} else {
			response.send("Sorry bro that's not yours");
		}
	});
});

// DELETE

router.delete("/:comment_id", function(request, response) {
	Comment.findById(request.params.comment_id, function(error, comment) {
		if (error) {
			console.log(error);
		} else if (request.user && comment.author.id.equals(request.user.id)) {
			Comment.findByIdAndRemove(comment.id, function(error) {
				if(error) {
					console.log(error);
				} else {
					response.redirect("/campgrounds/" + request.params.id);
				}
			});
		} else {
			response.send("<h2>Sorry bro that's not yours.<h2>");
		}
	});
});

function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	
	response.redirect("/login");
}

module.exports = router;