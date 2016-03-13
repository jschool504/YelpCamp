var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   phone: [String],
   image: String,
   coords: {
   	lat: Number,
   	long: Number
   },
   town: String,
   state: String,
   description: String,
   author: {
		id: {
		   type: mongoose.Schema.Types.ObjectId,
		   ref: "User"
	   },
	   username: "String"
   },
   comments: [
	   {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Comment"
	   }
	]
});

// if u dont have this u get an empty object in app.js require line
module.exports = mongoose.model("Campground", campgroundSchema);