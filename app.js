var express     			= require("express");
var app         			= express();
var bodyParser  			= require("body-parser");
var mongoose    			= require("mongoose");
var Campground				= require("./models/campgrounds");
var Comment					= require("./models/comment")
var seedDB					= require("./seeds");

var passport				= require("passport");
var LocalStrategy			= require("passport-local");
var User					= require("./models/user");

var commentRoutes			= require("./routes/comments");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIG

app.use(require("express-session")({
	secret: "CHEESE",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(request, response, next) {
	response.locals.currentUser = request.user;
	next();
});

// SCHEMA SETUP \\

app.get("/", function(request, response) {
	response.render("landing");
});

app.get("/campgrounds", function(request, response) {
	Campground.find({}, function(error, allCampgrounds) {
		if (error) {
			console.log(error);
		} else {
			response.render("campground/index", {campgrounds:allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(request, response) {
	var name = request.body.name;
	var image = request.body.image;
	var desc = request.body.description;
	var newCampground = {name: name, image: image, description: desc};
	Campground.create(newCampground, function(error, newlyCreated) {
		if (error) {
			console.log(error);
		} else {
			response.redirect("campground/index");
		}
	});
});

app.get("/campgrounds/new", function(request, response) {
   response.render("campground/new");
});

// SHOW
app.get("/campgrounds/:id", function(request, response) {
	Campground.findById(request.params.id).populate("comments").exec(function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			console.log(foundCampground)
			response.render("campground/show", {campground: foundCampground});
		}
	});
});

// COMMENTS ROUTES

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(request, response) {
	Campground.findById(request.params.id, function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			response.render("comments/new", {campground: foundCampground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(request, response) {
	Campground.findById(request.params.id, function(error, foundCampground) {
		if (error) {
			console.log(error);
		} else {
			Comment.create(request.body.comment,  function(error, createdComment) {
				if(error) {
					console.log(error);
				} else {
					foundCampground.comments.push(createdComment)
					foundCampground.save();
					response.redirect("/campgrounds/" + foundCampground.id);
				}
			});
		}
	})
});

// CREATE USER

app.get("/register", function(request, response) {
	response.render("register");
});

app.post("/register", function(request, response) {
	var newUser = new User({username: request.body.username});
	User.register(newUser, request.body.password, function(error, user) {
		if (error) {
			console.log(error);
			return response.render("register");
		}
		
		passport.authenticate("local")(request, response, function() {
			response.redirect("/campgrounds");
		});
	});
});

// LOGIN

app.get("/login", function(request, response) {
	response.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), function(request, response) {
	response.send("LOGGGGGGINGGGG INNNNN");
});

// LOGOUT

app.get("/logout", function(request, response) {
	request.logout();
	response.redirect("/campgrounds");
});

// Check if user is logged in

function isLoggedIn(request, response, next) {
	if (request.isAuthenticated()) {
		return next();
	}
	
	response.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function() {
	console.log("YelpCamp server is running...")
});