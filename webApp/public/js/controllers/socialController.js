'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('socialController', function ($scope, $http, $log, $location) {
	if($scope.user.facebook.token)
		$scope.radioFacebook = 'on';
	else
		$scope.radioFacebook = 'off';
	if($scope.user.twitter)
		$scope.radioTwitter = 'on';
	else
		$scope.radioTwitter = 'off';
	if($scope.user.google)
		$scope.radioGoogle = 'on';
	else
		$scope.radioGoogle = 'off';


	$scope.activateFacebook = function(){
		if($scope.radioFacebook == 'off'){
			$http({method: 'GET', url: '/connect/facebook'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conecctar");
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
		      $log.error("Error al conecctar");
		    });
	}

	$scope.activateTwitter = function(){
		if($scope.radioTwitter == 'off'){
			$http({method: 'GET', url: '/connect/twitter'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conecctar");
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
		      $log.error("Error al conecctar");
		    });
	}

	$scope.activateGoogle = function(){
		if($scope.radioGoogle == 'off'){
			$http({method: 'GET', url: '/connect/google'}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conecctar");
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
		      $log.error("Error al conecctar");
		    });
	}

});