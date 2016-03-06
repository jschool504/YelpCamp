var express     = require("express");
var router      = express.Router();

var Campground  = require("../models/campground.js");

router.get("/", function(request, response) {
	Campground.find({}, function(error, allCampgrounds) {
		if (error) {
			console.log(error);
		} else {
			response.render("campground/index", {campgrounds:allCampgrounds});
		}
	});
});

router.post("/", function(request, response) {
	var name = request.body.name;
	var image = request.body.image;
	var desc = request.body.description;
	var newCampground = {name: name, image: image, description: desc};
	Campground.create(newCampground, function(error, newlyCreated) {
		if (error) {
			console.log(error);
		} else {
			response.redirect("campground");
		}
	});
});

router.get("/new", function(request, response) {
   response.render("campground/new");
});

// SHOW
router.get("/:id", function(request, response) {
	Campground.findById(request.params.id).populate("comments").exec(function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			console.log(foundCampground)
			response.render("campground/show", {campground: foundCampground});
		}
	});
});

module.exports = router;