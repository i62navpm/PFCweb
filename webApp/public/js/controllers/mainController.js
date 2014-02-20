'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('mainController', function ($scope, $http, $log, $location) {

	if ($location.path() == '/_=_')
		$location.path('/').replace();
	
	$scope.init = function () {
		
		$http({method: 'GET', url: '/profile/'+$scope.userID}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conecctar");
		    });
	};
});