var express     = require("express");
var router      = express.Router();

var passport    = require("passport");
var User        = require("../models/user");

var middleware	= require("../middleware");

// ROOT ROUTE

router.get("/", function(request, response) {
	response.render("landing");
});

// CREATE USER

router.get("/register", function(request, response) {
	response.render("register");
});

router.post("/register", function(request, response) {
	var newUser = new User({username: request.body.username});
	User.register(newUser, request.body.password, function(error, user) {
		if (error) {
			console.log(error);
			return response.render("register");
		}
		
		passport.authenticate("local")(request, response, function() {
			request.flash("success", "Thanks for signing up! Happy Camping :D");
			response.redirect("/campgrounds");
		});
	});
});

// GET USERS

router.get("/users", middleware.isLoggedIn, function(request, response) {
	User.find({}, function(error, users) {
		if (error) {
			console.log(error);
		} else {
			response.render("users", {users: users});
		}
	});
});

// LOGIN

router.get("/login", function(request, response) {
	response.render("login");
});

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(request, response) {
	
});

// LOGOUT

router.get("/logout", function(request, response) {
	request.logout();
	request.flash("success", "You've been logged out!");
	response.redirect("/campgrounds");
});

module.exports = router;