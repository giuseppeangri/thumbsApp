(function() {
	
	'use strict';
	
	angular
		.module('app.main')
		.controller('MainController', MainController);
	
	MainController.$inject = ['$scope', '$state', '$rootScope'];	
	
	function MainController($scope, $state, $rootScope) {
				
		var mc = this;
		
		mc.inizialize = inizialize;
		mc.logout     = logout;
		
		mc.inizialize();
		
		return mc;
		
		function inizialize() {
			
		}
		
		function logout() {
			localStorage.removeItem('user');
			$state.go('home');
		}
				
	}
		
})();