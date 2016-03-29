(function() {

	'use strict';

	angular.module('app.map').controller('MapController', MapController);

	MapController.$inject = ['$scope', '$state', '$stateParams', '$cordovaGeolocation', '$http', 'SERVER_URL'];

	function MapController($scope, $state, $stateParams, $cordovaGeolocation, $http, SERVER_URL) {

		var mc = this;

		mc.inizialize         = inizialize;
		mc.updateMarker       = updateMarker;
		mc.checkDestination   = checkDestination;
		mc.getCurrentPosition = getCurrentPosition;
		mc.getDrivers         = getDrivers;
		mc.getPassengers      = getPassengers;

		mc.inizialize();

		return mc;

		function inizialize() {
			
			// SCOPE VARIABLES
			$scope.context = $stateParams.context;
			$scope.destination = {};
			$scope.markers = {};
			
			// START GOOGLE MAPS
			$scope.directionsDisplay;
			$scope.directionsService = new google.maps.DirectionsService();
			$scope.map;
			
			$scope.directionsDisplay = new google.maps.DirectionsRenderer();
			var latLng = new google.maps.LatLng(0, 0);
		  var mapOptions = {
		    zoom:17,
		    center: latLng,
				mapTypeId : google.maps.MapTypeId.ROADMAP,
				panControl: false,
	      disableDefaultUI: true,
	      zoomControl: true,
	      streetViewControl: false,
		  }
		  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		  $scope.directionsDisplay.setMap($scope.map);
		  
		  $scope.infoWindow = new google.maps.InfoWindow();
		  
	    $scope.icon = 'http://www.giuseppeangri.com/'+$scope.context+'.png';
						
			if ($scope.markers['departure'] == null) {
				$scope.markers['departure'] = new google.maps.Marker({
					map : $scope.map,
					animation : google.maps.Animation.DROP,
					position : latLng,
					icon : $scope.icon
				});
			} 
			
			mc.getCurrentPosition($scope.markers['departure']);
			
			setInterval(function() {
				mc.getCurrentPosition($scope.markers['departure']);
			}, 3000);

		}

		function updateMarker(type, id, position) {
			
			var latLng = new google.maps.LatLng(position.lat, position.lng);
			
			var currentIcon = 'http://www.giuseppeangri.com/'+type+'.png';
			
			if(id != 'departure') {
				if ($scope.markers[id] == null) {
					
					$scope.markers[id] = new google.maps.Marker({
						map : $scope.map,
						animation : google.maps.Animation.DROP,
						position : latLng,
						title : id,
	          icon : currentIcon
					});
					
		      $scope.markers[id].content = '<div class="infoWindowContent"></div>';
		      
		      google.maps.event.addListener($scope.markers[id], 'click', function(){
		          $scope.infoWindow.setContent('<h2>' + $scope.markers[id].title + '</h2>');
		          $scope.infoWindow.open($scope.map, $scope.markers[id]);
		      });
				} 
				else {
					$scope.markers[id].setPosition(latLng);
					$scope.map.setCenter(latLng);
				}
			}
			else {
				if ($scope.markers[id] == null) {
					$scope.markers[id] = new google.maps.Marker({
						map : $scope.map,
						animation : google.maps.Animation.DROP,
						position : latLng,
					});
				} 
				else {
					$scope.markers[id].setPosition(latLng);
					$scope.map.setCenter(latLng);
				}
			}

		}
		
		function getCurrentPosition(marker) {
			
			var options = {
				timeout : 10000,
				enableHighAccuracy : true
			};
			
			return $cordovaGeolocation.getCurrentPosition(options).then(function(position) {
				var cp = {
					lat : position.coords.latitude,
					lng : position.coords.longitude
				}
				
				// UPDATE CURRENT POSITION TO BACKEND SERVER
				$http({
					method : 'GET',
					url : SERVER_URL + 'update_position.php',
					params: {
						id : $scope.user.id,
						lat_dep : cp.lat,
						lng_dep : cp.lng,
						lat_dest : '',
						lng_dest : '',
						type : $scope.context,
					}
				});
				
				$scope.currentpos = cp;
				
				mc.updateMarker($scope.context, 'departure', cp);
			});
			
		}
		
		function checkDestination() {
			
			if($scope.destination.value.id) {
				
				$scope.destination_position = {
					lat : $scope.destination.value.geometry.location.lat(),
					lng : $scope.destination.value.geometry.location.lng()
				}
				
				// UPDATE DESTINATION CHOSE TO BACKEND SERVER
				$http({
					method : 'GET',
					url : SERVER_URL + 'update_position.php',
					params: {
						id : $scope.user.id,
						lat_dep : $scope.currentpos.lat,
						lng_dep : $scope.currentpos.lng,
						lat_dest : $scope.destination_position.lat,
						lng_dest : $scope.destination_position.lng,
						type : $scope.context,
					}
				});
				
				if ($scope.destination_marker == null) {
					$scope.destination_marker = new google.maps.Marker({
						map : $scope.map,
						animation : google.maps.Animation.DROP,
						position : $scope.destination_position
					});
				} 
				else {
					$scope.destination_marker.setPosition($scope.destination_position);
					$scope.map.setCenter($scope.destination_position);
				}
				
				var current = {
					lat : $scope.markers['departure'].position.lat(),
					lng : $scope.markers['departure'].position.lng()
				}
				
				// MAKE GOOGLE MAPS ROUTE
				var request = {
			    origin: current,
			    destination:$scope.destination_position,
			    travelMode: google.maps.TravelMode.DRIVING
			  };
			  
			  $scope.directionsService.route(request, function(result, status) {
			    if (status == google.maps.DirectionsStatus.OK) {
			      $scope.directionsDisplay.setDirections(result);
			    }
			  });
			  
			  if( $scope.context === 'passenger' ) {
				  //get drivers available
				  
				  setInterval(function() {
						mc.getDrivers()
					}, 3000);
				  
			  }
			  else if( $scope.context === 'driver' ) {
				  //get passenger available
				  
				  setInterval(function() {
						mc.getPassengers()
					}, 3000);
			  }
				
			}
			
		}
		
		function getDrivers() {
			$http({
				method : 'GET',
				url : SERVER_URL + 'get_positions.php',
				params: {
					type : 'driver'
				}
			})
			.then( function(result) {

				result.data.forEach(function(item) {
					
					mc.updateMarker('driver', result.id, {
						lat: item.lat_dep,
						lng: item.lng_dep
					});
					
				});
				
			});
		}
		
		function getPassengers() {
			$http({
				method : 'GET',
				url : SERVER_URL + 'get_positions.php',
				params: {
					type : 'passenger'
				}
			})
			.then( function(result) {
				
				result.data.forEach(function(item) {
					
					mc.updateMarker('passenger', result.id, {
						lat: item.lat_dep,
						lng: item.lng_dep
					});
					
				});
				
			});
		}

	}

})();
