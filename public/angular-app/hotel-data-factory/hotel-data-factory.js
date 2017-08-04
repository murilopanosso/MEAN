angular.module('meanhotel').factory('hotelDataFactory', hotelDataFactory);

function hotelDataFactory($http){
	return {
		hotelList: hotelList,
		hotelDisplay: hotelDisplay,
		postReview: postReview
	};

	function hotelList(){
		console.log("passou aqui hotel list");
		return $http.get('/api/hotels').then(complete).catch(failed);
		

	}

	function hotelDisplay(id){
		return $http.get('/api/hotels/'+ id).then(complete).catch(failed);
	}

	function postReview(id, review){
		return $http.post('/api/hotels/'+id+'/reviews/', review).then(complete).catch(failed);
	}

	function complete(response){
		console.log("passou aqui complete" + response);
		return response;
		
	}

	function failed(err){
		console.log(err.statusText);
	}
}