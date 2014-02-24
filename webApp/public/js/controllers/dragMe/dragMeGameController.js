'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('dragMeGameController', function ($scope, $http, $log, $window) {
	$scope.init=function(){
		$window.configuration = $scope.configuration;
		$window.calibration = $scope.calibration;
		$window.userID = $scope.userID;
	}
});