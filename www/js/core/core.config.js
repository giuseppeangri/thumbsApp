(function() {
	
	'use strict';
	
	angular
		.module('app.core')
		.config(config)
		.run(run);
	
	config.$inject = ['$stateProvider', '$urlRouterProvider', '$httpProvider'];	
	
	function config($stateProvider, $urlRouterProvider, $httpProvider) {
		
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
		
	  $stateProvider
	  
	  	.state('home', {
		  	url					: '/',
	      templateUrl	: 'templates/home.html',
	  	})
	  	
	  	.state('signin', {
		  	url						: '/signin',
	      templateUrl		: 'templates/signin.html',
	      controller		: 'SignInController',
	      controllerAs	: 'SignInController',
	  	})
	  	
	  	.state('signup', {
		  	url						: '/signup',
	      templateUrl		: 'templates/signup.html',
	      controller		: 'SignUpController',
	      controllerAs	: 'SignUpController',
	  	})
	  	
	  	.state('main', {
		  	url						: '/main',
	      templateUrl		: 'templates/main.html',
	      controller		: 'MainController',
	      controllerAs	: 'MainCtrl',
	  	})
	  	
	  	.state('mapDriver', {
		  	url						: '/map/driver',
	      templateUrl		: 'templates/map.html',
	      controller		: 'MapController',
	      controllerAs	: 'MapCtrl',
	      params				: {
		      'context': 'driver',
			  }
	  	})
	  	
	  	.state('mapPassenger', {
		  	url						: '/map/passenger',
	      templateUrl		: 'templates/map.html',
	      controller		: 'MapController',
	      controllerAs	: 'MapCtrl',
	      params				: {
		      'context': 'passenger',
			  }
	  	})
	  		
	  // if none of the above states are matched, use this as the fallback
	  $urlRouterProvider.otherwise('/');
		
	}
	
	run.$inject = ['$ionicPlatform', 'ngFB', '$rootScope', '$state'];	
	
	function run($ionicPlatform, ngFB, $rootScope, $state) {
		
		ngFB.init({appId: '473494396167903'});
		
		$ionicPlatform.ready(function() {
	    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	    // for form inputs)
	    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
	      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
	      cordova.plugins.Keyboard.disableScroll(true);
	    }
	    if (window.StatusBar) {
	      // org.apache.cordova.statusbar required
	      StatusBar.styleDefault();
	    }
	    if(localStorage.getItem('user')) {
	    	$rootScope.user = JSON.parse(localStorage.getItem('user'));
	    	$state.go('main');
	    }
	  });
	  
	}
	
})();