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

// CREATE

router.post("/", isLoggedIn, function(request, response) {
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

router.get("/new", isLoggedIn, function(request, response) {
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

// EDIT

router.get("/:id/edit", isLoggedIn, function(request, response) {
	
	Campground.findById(request.params.id, function(error, campground) {
		if (error) {
			response.redirect("/campgrounds");
		} else if (campground.author.id != request.user.id) {
			response.send("YOU CANT DO THAT");
		} else {
			response.render("campground/edit", {campground: campground});
		}
	});
});

// UPDATE

router.put("/:id", isLoggedIn, function(request, response) {
	Campground.findByIdAndUpdate(request.params.id, request.body.campground, function(error, campground) {
	    if (error) {
	    	response.redirect("/campgrounds");
	    } else {
	    	response.redirect("/campgrounds/" + campground.id);
	    }
	});
});

// DESTROY

router.delete("/:id", isLoggedIn, function(request, response) {
	
	Campground.findById(request.params.id, function(error, campground) {
		if (error) {
			response.redirect("/campgrounds");
		} else if (campground.author.id.equals(request.user.id)) {
			Campground.findByIdAndRemove(campground.id, function(error) {
				response.redirect("/campgrounds");
			});
		}
	});
});

// MIDDLEWARE

function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	
	response.redirect("/login");
}

function cbeckCampgroundOwnership(request, response, next) {
	Campground.findById(request.params.id, function(error, campground) {
		if (error) {
			response.redirect("/campgrounds");
		} else {
			//does own?
			if (campground.author.id.equals(request.user._id)) {
				response.render("campgrounds/edit", {campground: campground});
			} else {
				response.send("YOU DONT HAVE PERSMISSION TO DO THIS!!");
			}
		}
	});
}

module.exports = router;