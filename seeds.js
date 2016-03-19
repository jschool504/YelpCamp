var Campground  = require("./models/campground");
var Comment		= require("./models/comment");
var User		= require("./models/user");
var mongoose    = require("mongoose");
var fs			= require("fs");

var parsePhone	= require("./public/js/parsePhone");

function loadDB() {
	var campsiteData = fs.readFileSync("WestCamp.csv");
	var campsiteDataString = campsiteData.toString();
	var campsiteDataArray = campsiteDataString.split("\n");
	campsiteDataArray.pop();
	return campsiteDataArray;
}

function seedDB(num) {
	var campsites = loadDB();
	
	Campground.remove({}, function(error) {
		if (error) {
			console.log(error);
		} else {
			console.log("Removed all campgrounds");
		}
		
		User.findOne({username: "admin"}, function(error, adminUser) {
			if (error) {
				console.log(error);
			} else {
				
				var campsiteCounter = 1;
				
				if (num > campsites.length) { num = campsites.length };
				
				for (var i = 0; i < num; i++) {
					//var campsiteIndex = parseInt(Math.random() * (campsites.length - 25));
					var campsiteIndex = i;
					var campsite = campsites[campsiteIndex];
					
					campsite = campsite.split(",");
					
					var amenitiesArray = campsite[9].split(" ");
					amenitiesArray.pop();
					
					var cmpgrnd = {
						name: campsite[2],
						phone: parsePhone(campsite[4]),
						image: "/images/campsite.png",
						coords: {
							lat: campsite[1],
							long: campsite[0]
						},
						town: campsite[13],
						state: campsite[10],
						description: campsite[6],
						amenities: amenitiesArray,
						author: {
							id: adminUser._id,
							username: adminUser.username
						}
					}
					
					console.log("added campground " + campsiteCounter);
					campsiteCounter++;
					
					Campground.create(cmpgrnd, function(error, campground) {
						if (error) {
							console.log(error);
						} else {
							campground.save();
						}
					});
				}
			}
		});
	});
}

module.exports = seedDB;