angular.module('meanhotel').factory('userDataFactory', userDataFactory);

function userDataFactory($http){
	return {
		postRegisterUser: postRegisterUser,
		postLoginUser: postLoginUser
	};


	function postRegisterUser(user){
		return $http.post('/api/users/register', user).then(complete).catch(failed);
	}

	function postLoginUser(user){
		return $http.post('/api/users/login', user).then(complete).catch(failed);
	}

	function complete(response){
		return response;	
	}

	function failed(err){
		console.log(err.statusText);
	}
}