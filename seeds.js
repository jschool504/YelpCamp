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
					
					var amenitiesArray = campsite[9].split(" ");
					amenitiesArray.pop();
					
					amenitiesArray.forEach(function(amenity, index) {
						switch (amenity) {
							case "NH":
								amenitiesArray[index] = "No RV Hookups";
								break;
							case "E":
								amenitiesArray[index] = "Electric Hookups";
								break;
							case "WE":
								amenitiesArray[index] = "Water and Electric Hookups";
								break;
							case "WES":
								amenitiesArray[index] = "Water, Electric, and Sewer Hookups";
								break;
							case "DP":
								amenitiesArray[index] = "Sanitary Dump";
								break;
							case "ND":
								amenitiesArray[index] = "No Dump";
								break;
							case "ft":
								//placeholder for rv length
								break;
							case "FT":
								amenitiesArray[index] = "Flushing Toilets";
								break;
							case "VT":
								amenitiesArray[index] = "Vault Toilets";
								break;
							case "FTVT":
								amenitiesArray[index] = "Flushing and Vault Toilets";
								break;
							case "PT":
								amenitiesArray[index] = "Pit Toilets";
								break;
							case "NT":
								amenitiesArray[index] = "No Toilets";
								break;
							case "DW":
								amenitiesArray[index] = "Drinking Water";
								break;
							case "NW":
								amenitiesArray[index] = "No Drinking Water";
								break;
							case "SH":
								amenitiesArray[index] = "Showers";
								break;
							case "NS":
								amenitiesArray[index] = "No Showers";
								break;
							case "RS":
								amenitiesArray[index] = "Reservations";
								break;
							case "NR":
								amenitiesArray[index] = "No Reservations";
								break;
							case "PA":
								amenitiesArray[index] = "Pets Allowed";
								break;
							case "NP":
								amenitiesArray[index] = "No Pets";
								break;
							case "L$":
								amenitiesArray[index] = "<$12";
								break;
							default:
								console.log("default switch case");
						}
					});
					
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