(function() {
	
	'use strict';
	
	angular
		.module('app.signup')
		.controller('SignUpController', SignUpController);
	
	SignUpController.$inject = ['$scope', 'ngFB', '$http', 'SERVER_URL'];	
	
	function SignUpController($scope, ngFB, $http, SERVER_URL) {
				
		var suc = this;
		
		suc.fbLogin = fbLogin;
		suc.getUser = getUser;
		
		return suc;

		function fbLogin() {
			ngFB.login({
				scope : 'email,publish_actions'
			}).then(function(response) {
				if (response.status === 'connected') {
					console.log('Facebook login succeeded');
					//$scope.closeLogin();
					getUser();
				} else {
					alert('Facebook login failed');
				}
			});
		}

		function getUser() {
			ngFB.api({
				path : '/me',
				params : {
					fields : 'id,email, first_name, last_name'
				}
			}).then(function(user) {
				$scope.user = user;
				subscribeUser();
			}, function(error) {
				alert('Facebook error: ' + error.error_description);
			});
		}

		function subscribeUser() {
			$http({
				method : 'GET',
				url : SERVER_URL + "user_subscribe.php?email=" + $scope.user.email + "&name=" + $scope.user.first_name +"&surname=" + $scope.user.last_name
			}).then(function successCallback(response) {
				var res = response.data;
				if (res.result) {
					$scope.responseMessage = "Registrazione effettuata correttamente.";
				} else {
					$scope.responseMessage = "L'email " + $scope.user.email + " risulta già registrata.";
				}
			}, function errorCallback(response) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
			});
		}
				
	}
		
})();