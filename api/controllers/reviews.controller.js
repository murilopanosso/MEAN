var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

module.exports.reviewsGetAll = function(request, response){
  var hotelId = request.params.hotelId;
  console.log("GET hoteId", hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, doc){
      if(err){
        console.log("Error finding hotels");
        response
        .status(500)
        .json(err);
      }else if(!doc){
        response
        .status(500)
        .json({"message" : "HotelId not found"});   
        
      }else if(doc.reviews.length == 0){
        response
        .status(200)
        .json({"message" : "No reviews for this hotel yet"});  
      }else{
        console.log("Returned doc", doc); 
        response
          .status(200)
          .json(doc.reviews);  
      }               
      
    });
};


module.exports.reviewsGetOne = function(request, response){
  var hotelId = request.params.hotelId;
  var reviewId = request.params.reviewId;
  console.log("GET reviewId" + reviewId +  "for hotelId" + hotelId);
 Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel){ 
        if(err){
            response
              .status(500)
              .json({"message" : "Error finding hotels"});
        }else if(!hotel){
            response
              .status(500)
              .json({"message" : "HotelId not found"});
        }else{
          console.log("Returned hotel", hotel); 
          var review = hotel.reviews.id(reviewId);
          if(!review){
            response
              .status(500)
              .json({"message" : "ReviewId not found"});
          }else{
            response
              .status(200)
              .json(review);    
          }
        }
      
    });
};


var _addReview = function(request, response, hotel){
    hotel.reviews.push({
        name : request.body.name,
        rating : parseInt(request.body.rating, 10),
        review : request.body.review
    });

    hotel.save(function(err, hotelUpdated){
        if(err){
            response
              .status(500)
              .json(err);
        }else{
            response
              .status(200)
              .json(hotelUpdated.reviews[hotelUpdated.reviews.length - 1]);
        }
    });
};


module.exports.reviewsAddOne = function(request, response){
  var hotelId = request.params.hotelId;
  console.log("GET hoteId", hotelId);

  Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, doc){
        var res = {
            status : 200,
            message : []
        }
      if(err){
        console.log("Error finding hotels");
        res.status = 500;
        res.message = err;
      }else if(!doc){
        res.status = 404;
        res.message = {"message" : "HotelId not found"};   
        
      }else if(doc.reviews.length == 0){
        
        res.status = 200;
        res.message = {"message" : "No reviews for this hotel yet"};  
      }
      if(doc){
        _addReview(request, response, doc); 
      }else{
        response
          .status(res.status)
          .json(res.message);
      }               
      
    });
};

module.exports.reviewsUpdateOne = function(request, response){
    var hotelId = request.params.hotelId;
    var reviewId = request.params.reviewId;
    console.log("GET reviewId" + reviewId +  "for hotelId" + hotelId);
    Hotel
    .findById(hotelId)
    .select('reviews')
    .exec(function(err, hotel){ 
        res = {
            status : 200,
            message : hotel
        }
        if(err){
            res.status = 500;
            res.message = {"message" : "Error finding hotels"};
        }else if(!hotel){
            res.status = 500;
            res.message = {"message" : "HotelId not found"};
        }else{
          console.log("Returned hotel", hotel); 
          var review = hotel.reviews.id(reviewId);
          if(!review){
            res.status(500);
            res.message({"message" : "ReviewId not found"});
        }

        if(res.status !== 200){
            response
            .status(res.status)
            .json(res.message);    
        }else{
            review.name = request.body.name;
            review.rating = parseInt(request.body.rating, 10);
            review.review = request.body.review;
            hotel.save(function(err, hotelUpdated) {
              if (err) {
                res.status = 500;
                res.message = err;
            } else {
                res.status = 204;
                res.message = {"message" : "review Updated"};
            }
            response
              .status(res.status)
              .json(res.message);
        });
        }
    }
});

};

module.exports.reviewsDeleteOne = function(request, response){

   var hotelId = request.params.hotelId;
   var reviewId = request.params.reviewId;
   console.log("GET reviewId" + reviewId +  "for hotelId" + hotelId);
   Hotel
   .findById(hotelId)
   .select('reviews')
   .exec(function(err, hotel){ 
    res = {
        status : 200,
        message : hotel
    }
    if(err){
        res.status = 500;
        res.message = {"message" : "Error finding hotels"};
    }else if(!hotel){
        res.status = 404;
        res.message = {"message" : "HotelId not found"};
    }else{
      console.log("Returned hotel", hotel); 
      var review = hotel.reviews.id(reviewId);
      if(!review){
        res.status(500);
        res.message({"message" : "ReviewId not found"});
    }

    if(res.status !== 200){
        response
        .status(res.status)
        .json(res.message);    
    }else{
        hotel.reviews.id(reviewId).remove();
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res.status = 500;
            res.message = err;
        } else {
            res.status = 204;
            res.message = {"message" : "review removed"};
        }
        response
        .status(res.status)
        .json(res.message);
    });
    }
}
});


}