var Campground  = require("./models/campgrounds");
var Comment		= require("./models/comment");
var mongoose    = require("mongoose");

var data = [
	{
		name: "Dismals Canyon",
		image: "http://dismalscanyon.com/campsites/images/sleeping_water_5177_250px.jpg",
		description: "Scattered off the main path and given a wide berth from one another, Dismals Canyon primitive campsites offer the ultimate outdoor experience."
	},
	{
		name: "Silver Canoe Campground",
		image: "http://visitindianacountypa.org/wp-content/themes/indianna/images/graphics/silvercanoecampground3.jpg",
		description: "Silver Canoe Campground is a fun place to play for young and old alike. We are located on 38 acres on State Route 210 on the upper end of the Keystone Power Dam Lake,  in a serene wooded valley in western PA. Open April 1 through October 31. Open year round with limited utilities. Full hook-up sites.  We offer 83 Sites for a variety of campers from weekenders to permanent. We offer a recreation hall which can be used for meetings, parties, etc...  We have a swimming pool for our guests to enjoy."
	},
	{
		name: "Newport News Park Campground",
		image: "http://www.virginiacampgrounds.org/images/1365020216Best1CampgroundPhotosAugust2009BEST.jpg",
		description: "Our 188 campsites are spaciously arranged throughout natural woodlands and are surrounded by many comforts of home including, electrical and water hookups, heated showers and flush toilets, paved roadways and parking pads, picnic tables, grills and playgrounds, laundry facilities, a camper store for food and supplies, 24-hour security throughout the Park, and a centralized sewage disposal station, to name a few. The Campground also boasts two youth group sites and a Boy Scout Primitive Area. Campers and outdoor enthusiasts find Newport News Park a perfect retreat for hiking or bicycling on the Park’s many trails; picnicking in shelters with outdoor grills; geocaching; fishing, boating and canoeing on the Park’s scenic lakes and inlets; and enjoying sports such as disc golf, archery, and golf. The Park, located between Richmond and Virginia Beach, is ideally situated in an area rich in historical attractions, theme parks, museums and entertainment."
	}
];

function seedDB() {
	Campground.remove({}, function(error) {
		if (error) {
			console.log(error);
		} else {
			console.log("Removed all campgrounds");
		}
		
		data.forEach(function(seed) {
			Campground.create(seed, function(error, campground) {
				if (error) {
					console.log(error);
				} else {
					console.log("added campground");
					
					Comment.create({
						text: "This place is great, but I wish there was internet",
						author: "Homer"
					}, function(error, comment) {
						if (error) {
							console.log(error);
						} else {
							campground.comments.push(comment);
							campground.save();
							console.log("Created new comment");
						}
					});
				}
			});
			
			Comment.create()
		});
	});
}

module.exports = seedDB;