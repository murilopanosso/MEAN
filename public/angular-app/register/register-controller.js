angular.module('meanhotel').controller('RegisterController', RegisterController);

function RegisterController(userDataFactory){
	var vm = this;
	vm.register = function(){
		var user = {
			username: vm.username,
			password: vm.password
		};

		if(!vm.username || !vm.password){
			vm.error = "Please, add username and password.";
		}else{
			if(vm.password === vm.passwordRepeat){
				userDataFactory.postRegisterUser(user).then(function(response){
					console.log(":P ...", response);
					if (response.status == 201){
						console.log("funfa...");
						vm.message = "Successful registration, please login.";
						vm.error = '';
					}
				}).catch(function(err){
					console.log(err);
				});
			}else{
				console.log('Please make sure the password match.');
				vm.error = "Please make sure the password match.";
			}
			
		}
	}

}