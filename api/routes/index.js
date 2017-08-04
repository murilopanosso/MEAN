var express = require('express');
var router = express.Router();

var controllerHotels = require('../controllers/hotels.controllers');
var controllerReviews = require('../controllers/reviews.controller');
var controllerUsers = require('../controllers/users.controller')


//hotels routes
router
  .route('/hotels')
  .get(controllerHotels.hotelsGetAll)
  .post(controllerHotels.hotelsAddOne);

router
  .route('/hotels/:hotelId')
  .get(controllerHotels.hotelsGetOne)
  .put(controllerHotels.hotelsUpdateOne)
  .delete(controllerHotels.hotelsDeleteOne);
  

//reviews routes
router
  .route('/hotels/:hotelId/reviews')
  .get(controllerReviews.reviewsGetAll)
  .post(controllerUsers.authenticate, controllerReviews.reviewsAddOne);


router
  .route('/hotels/:hotelId/reviews/:reviewId')
  .get(controllerReviews.reviewsGetOne)
  .put(controllerReviews.reviewsUpdateOne)
  .delete(controllerReviews.reviewsDeleteOne);

  //Authentication

  router
    .route('/users/register')
    .post(controllerUsers.register);

  router
    .route('/users/login')
    .post(controllerUsers.login);


module.exports = router;