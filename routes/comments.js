var express     = require("express");
var router      = express.Router({mergeParams: true});

var Campground  = require("../models/campground.js");
var Comment     = require("../models/comment.js");

var middleware	= require("../middleware");

// COMMENTS ROUTES

router.get("/new", middleware.isLoggedIn, function(request, response) {
	Campground.findById(request.params.id, function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			response.render("comments/new", {campground: foundCampground});
		}
	});
});

// Create Comment

router.post("/", middleware.isLoggedIn, function(request, response) {
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

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(request, response) {
	Campground.findById(request.params.id, function(error, campground) {
		Comment.findById(request.params.comment_id, function(error, comment) {
			if (error) {
				console.log(error);
			} else {
				response.render("comments/edit", {campground: campground, comment: comment});
			}
		});
	});
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(request, response) {
	Comment.findByIdAndUpdate(request.params.comment_id, request.body.comment, function(error) {
		if (error) {
			console.log(error);
		} else {
			response.redirect("/campgrounds/" + request.params.id);
		}
	});
});

// DELETE

router.delete("/:comment_id", middleware.checkCommentOwnership, function(request, response) {
	Comment.findByIdAndRemove(comment.id, function(error) {
		if(error) {
			console.log(error);
		} else {
			response.redirect("/campgrounds/" + request.params.id);
		}
	});
});

module.exports = router;