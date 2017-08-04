var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(request, response){
	var lng = parseFloat(request.query.lng);
	var lat = parseFloat(request.query.lat);
	var point = {
		type : "Point",
		coordinates : [lng, lat]
	};
	var geoPoints = {
		spherical : true,
		maxDistance : 2000,
		num : 5
	};
	Hotel
	.geoNear(point, geoPoints, function(err, results, stats){
		if(err){
			console.log("Error finding hotels by geolocation");
			response
			.status(500)
			.json(err);
		}else if(!results){
			console.log("No hotels found in this area");
			response
			.status(500)
			.json({"message" : "Error trying to retrieve hotels"});
		}else if(results.length == 0){
			response
			.status(200)
			.json({"message" : "No hotels fond in this area"});
		}else{
			console.log("Geo results", results);
			console.log("Geo stats", stats);
			response
			.status(200)
			.json(results);
		} 
		
	});
};



module.exports.hotelsGetAll = function(request, response){
	console.log('requested by: ' + request.user)
	var offset = 0;
	var count = 5;
	var maxCount = 15;

	if(request.query && request.query.lat && request.query.lng){
		console.log("testandoo " + request.query.lat);
		if(isNaN(request.query.lat) || isNaN(request.query.lng)){
		 response
		 .status(400)
		 .json({ "message" : "if supplied query string lat and lng should be number"}); 
	 }else{
		 runGeoQuery(request, response);
	 }

	 return;
 }

 if(request.query && request.query.offset){
	offset = parseInt(request.query.offset, 10);      
}
if(request.query && request.query.count){
	count = parseInt(request.query.count, 10);      
}

if(isNaN(offset) || isNaN(count)){
	response
	.status(400)
	.json({ "message" : "if supplied query string offset and count should be number"});
	return; 
}

if(count > maxCount){
	response
	.status(400)
	.json({ "message" : "Count limit of " + maxCount + ' exceeded'});
	return; 
}



if(request.query.lat || request.query.lng){
 response
 .status(400)
 .json({ "message" : "Wrong parameters"});
 return; 
}

Hotel
.find()
.skip(offset)
.limit(count)
.exec(function(err, hotels){
	if(err){
		console.log("Error finding hotels");
		response
		.status(500)
		.json(err);
	}else if(!hotels){
		response
		.status(500)
		.json({"message" : "HotelId not found"});   

	}else{
		console.log("Found hotels", hotels.length);  
		response
		.json(hotels);  
	}
	
});
};

module.exports.hotelsGetOne = function(request, response){
	var hotelId = request.params.hotelId;
	console.log("GET hoteId", hotelId);

	Hotel
	.findById(hotelId)
	.exec(function(err, doc){
		res = {
			status : 200,
			message : doc
		}
		if(err){
			console.log("error finding hotel");
			res.status = 500;
			res.message = err;
		}else if(!doc){
			res.status = 404;
			res.message = {"message" : "HotelId not found"};
		}

		response
		.status(res.status)
		.json(res.message);	
	});

	
};


var _splitArray = function(input) {
  var output;
  if (input && input.length > 0) {
    output = input.split(";");
  } else {
    output = [];
  }
  return output;
};

module.exports.hotelsAddOne = function(request, response){
	 console.log("POST new hotel");

  Hotel
    .create({
      name : request.body.name,
      description : request.body.description,
      stars : parseInt(request.body.stars,10),
      services : _splitArray(request.body.services),
      photos : _splitArray(request.body.photos),
      currency : request.body.currency,
      location : {
        address : request.body.address,
        coordinates : [parseFloat(request.body.lng), parseFloat(request.body.lat)]
      }
    }, function(err, hotel) {
      if (err) {
        console.log("Error creating hotel");
        response
          .status(400)
          .json(err);
      } else {
        console.log("Hotel created!", hotel);
        response
          .status(201)
          .json(hotel);
      }
    });
	
};

module.exports.hotelsUpdateOne = function(request, response){
	var hotelId = request.params.hotelId;
		console.log("GET hoteId", hotelId);

		Hotel
		.findById(hotelId)
		.select("-reviews -rooms")
		.exec(function(err, doc){
			res = {
				status : 200,
				message : doc
			}
			if(err){
				console.log("error finding hotel");
				res.status = 500;
				res.message = err;
			}else if(!doc){
				res.status = 404;
				res.message = {"message" : "HotelId not found"};
			}

			if(res.status !== 200){
				response
				  .status(res.status)
				  .json(res.message);	
			}else{
				doc.name = request.body.name;
	      doc.description = request.body.description;
	      doc.stars = parseInt(request.body.stars,10);
	      doc.services = _splitArray(request.body.services);
	      doc.photos = _splitArray(request.body.photos);
	      doc.currency = request.body.currency;
	      doc.location = {
	        address : request.body.address,
	        coordinates : [parseFloat(request.body.lng), parseFloat(request.body.lat)]
	      };

	      doc.save(function(err, updatedHotel){
	      	if(err){
	      		response
	      		 .status(500)
	      		 .json(err);
	      	}else{
	      		response
	      		  .status(204)
	      		  .json();

	      	}
	      });

			}

			
		});
};


module.exports.hotelsDeleteOne = function(request, response){
	var hotelId = request.params.hotelId;

	Hotel 
	  .findByIdAndRemove(hotelId)
	  .exec(function(err, hotel){
	  	if(err){
	  		response
	  		  .status(404)
	  		  .json(err);
	  	}else{
	  		console.log("Hotel deleted", hotelId);
	  		response
	  		  .status(204)
	  		  .json();

	  	}
	  });


};