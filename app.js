// GENERAL REQUIRES

var express     		= require("express");
var app         		= express();
var bodyParser  		= require("body-parser");
var mongoose    		= require("mongoose");
var Campground			= require("./models/campground");
var Comment				= require("./models/comment")
var seedDB				= require("./seeds");
var passport			= require("passport");
var LocalStrategy		= require("passport-local");
var User				= require("./models/user");
var methodOverride		= require("method-override");
var flash				= require("connect-flash");

// ROUTE REQUIRES

var commentRoutes		= require("./routes/comments");
var campgroundRoutes	= require("./routes/campgrounds");
var indexRoutes			= require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB(1000); // seed the database

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
	response.locals.error = request.flash("error");
	response.locals.success = request.flash("success");
	next();
});

// SETUP ROUTES

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// LISTENER

app.listen(80, "127.0.0.1", function() {
	console.log("YelpCamp server is running...");
});
