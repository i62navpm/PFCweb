'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('socialController', function ($scope, $http, $log, $location) {
	
	try{
		if($scope.user.facebook.token)
			$scope.radioFacebook = 'on';
		else
			$scope.radioFacebook = 'off';
		if($scope.user.twitter.token)
			$scope.radioTwitter = 'on';
		else
			$scope.radioTwitter = 'off';
		if($scope.user.google.token)
			$scope.radioGoogle = 'on';
		else
			$scope.radioGoogle = 'off';
	}catch(err){
		$scope.messageSocial = "El servicio no se ha podido cambiar, inténtelo de nuevo"
	}


	$scope.activateFacebook = function(){
		if($scope.radioFacebook == 'off'){
			$http({method: 'GET', url: '/connect/facebook'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conectar");
		    });
		}
			
	}
	$scope.desactivateFacebook = function(){
		if($scope.radioFacebook == 'on')
			$http({method: 'GET', url: '/unlink/facebook'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conectar");
		    });
	}

	$scope.activateTwitter = function(){
		if($scope.radioTwitter == 'off'){
			$http({method: 'GET', url: '/connect/twitter'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conectar");
		    });
		}
			
	}
	$scope.desactivateTwitter = function(){
		if($scope.radioTwitter == 'on')
			$http({method: 'GET', url: '/unlink/twitter'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conectar");
		    });
	}

	$scope.activateGoogle = function(){
		if($scope.radioGoogle == 'off'){
			$http({method: 'GET', url: '/connect/google'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conectar");
		    });
		}
			
	}
	$scope.desactivateTwitter = function(){
		if($scope.radioTwitter == 'on')
			$http({method: 'GET', url: '/unlink/google'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conectar");
		    });
	}

});