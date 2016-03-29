(function() {
	
	'use strict';
	
	angular
		.module('app.signin')
		.controller('SignInController', SignInController);
	
	SignInController.$inject = ['$scope', '$rootScope', '$http', 'SERVER_URL', '$state'];	
	
	function SignInController($scope, $rootScope, $http, SERVER_URL, $state) {
				
		var sic = this;
		
		sic.login      = login;
		sic.initialize = initialize;
		
		sic.initialize();

		return sic;

		function initialize() {
			$scope.data = {};
		}

		function login() {
			
			$http({
				method : 'GET',
				url : SERVER_URL + "users.php?email=" + $scope.data.email
			})
			.then(function successCallback(response) {
					
				var res = response.data;
					
				if (res.result) {
						
					var user = {
						id : res.id,
						email : $scope.data.email
					};
						
					localStorage.setItem('user', JSON.stringify(user));
					$rootScope.user = user;
					$state.go('main');
						
				} 
				else {
					$scope.responseMessage = "Email/password non corretti";
				}
										
			}, 
			function errorCallback(response) {
			});
		}
	}

})();