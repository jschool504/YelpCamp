var express     = require("express");
var router      = express.Router();

var Campground  = require("../models/campground.js");
var middleware	= require("../middleware");

router.get("/", function(request, response) {
	Campground.find({}, null, {sort: "name"}, function(error, allCampgrounds) {
		if (error) {
			console.log(error);
		} else {
			response.render("campground/index", {campgrounds:allCampgrounds});
		}
	});
});

// CREATE

router.post("/", middleware.isLoggedIn, function(request, response) {
	var name = request.body.name;
	var image = request.body.image;
	var desc = request.body.description;
	var author = {
		id: request.user._id,
		username: request.user.username
	};
	var newCampground = {name: name, image: image, description: desc, author: author};
	Campground.create(newCampground, function(error, newlyCreated) {
		if (error) {
			console.log(error);
		} else {
			response.redirect("/campgrounds");
		}
	});
});


// NEW

router.get("/new", middleware.isLoggedIn, function(request, response) {
   response.render("campground/new");
});

// SHOW
router.get("/:id", function(request, response) {
	Campground.findById(request.params.id).populate("comments").exec(function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			//console.log(foundCampground)
			response.render("campground/show", {campground: foundCampground});
			//console.log(foundCampground);
		}
	});
});

// EDIT

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(request, response) {
	Campground.findById(request.params.id, function(error, campground) {
		response.render("campground/edit", {campground: campground});
	});
});

// UPDATE

router.put("/:id", middleware.checkCampgroundOwnership, function(request, response) {
	Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(error, campground) {
	    if (error) {
	    	response.redirect("/campgrounds");
	    } else {
	    	response.redirect("/campgrounds/" + campground.id);
	    }
	});
});

// DESTROY

router.delete("/:id", middleware.checkCampgroundOwnership, function(request, response) {
	Campground.findByIdAndRemove(request.params.id, function(error) {
		response.redirect("/campgrounds");
	});
});

module.exports = router;