angular.module('meanhotel').controller('HotelController', HotelController);

function HotelController($route, hotelDataFactory, $routeParams, AuthFactory, jwtHelper, $window){
	var vm = this;
	var id = $routeParams.id;
	hotelDataFactory.hotelDisplay(id).then(function(response){
		vm.hotel = response.data;
		vm.stars = _getStarRating(response.data.stars);
	});

	function _getStarRating(stars){
		return new Array(stars);
	}

	vm.isLoggedIn = function(){
		if(AuthFactory.isLoggedIn){
			return true;
		}else{
			return false;
		}
	};

	vm.addReview = function(){

		var token = jwtHelper.decodeToken($window.sessionStorage.token);
		var username = token.username;

		var postData = {
			name : username,
			rating: vm.rating,
			review: vm.review
		};
		if (vm.reviewForm.$valid){
			hotelDataFactory.postReview(id, postData).then(function(response){
				console.log("escrevi sai coreendo...", response);
				if (response.status == 200){
					console.log("escrevi sai coreendo...");
					$route.reload();
				}
			}).catch(function(err){
				console.log(err);
			});
		}else{
			vm.isSubmitted = true;
		}
	};
}