var Campground  = require("./models/campground");
var Comment		= require("./models/comment");
var User		= require("./models/user");
var mongoose    = require("mongoose");
var fs			= require("fs");

var parsePhone		= require("./public/js/parsePhone");

var data = [];

function loadDB() {
	var campsiteData = fs.readFileSync("WestCamp.csv");
	var campsiteDataString = campsiteData.toString();
	return campsiteDataString.split("\n");
}

function seedDB() {
	var campsites = loadDB();
	
	console.log(campsites[100].split(","));
	
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
				
				for (var i = 0; i < 25; i++) {
					//var campsiteIndex = parseInt(Math.random() * (campsites.length - 25));
					var campsiteIndex = i;
					var campsite = campsites[campsiteIndex];
					
					campsite = campsite.split(",");
					
					var cmpgrnd = {
						name: campsite[2],
						phone: parsePhone(campsite[4]),
						image: "http://lorempixel.com/" + parseInt(256 + (Math.random() * 100)) + "/" + parseInt(256 + (Math.random() * 100)) + "/nature/",
						coords: {
							lat: campsite[1],
							long: campsite[0]
						},
						town: campsite[13],
						state: campsite[10],
						description: campsite[6],
						author: {
							id: adminUser._id,
							username: adminUser.username
						}
					}
					
					Campground.create(cmpgrnd, function(error, campground) {
						if (error) {
							console.log(error);
						} else {
							campground.save();
							console.log("added campground " + campsiteCounter);
							campsiteCounter++;
						}
					});
				}
			}
		});
	});
}

module.exports = seedDB;