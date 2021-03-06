'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('mainController', function ($scope, $http, $log, $location) {

	if ($location.path() == '/_=_')
		$location.path('/').replace();
	
	$scope.init = function () {
		//$log.log("inicio");
		
		$http({method: 'GET', url: '/profile/'+$scope.userID}).
	    	success(function(data, status, headers, config) {
		      $scope.user = data;
		      $scope.user.actualPong = null;
		      $scope.user.actualTetris = null;
		      $scope.user.actualDragMe = null;
		      $scope.user.actualEyeLeft = $scope.user.calibration.eyeLeft;
		      $scope.user.actualEyeRight = $scope.user.calibration.eyeRight;
				//$log.log("ya");		      
		    }).
		    error(function(data, status, headers, config) {
		      $log.error("Error al conecctar");
		    });

	};

	$scope.submitCalibration = function () {
		
		var calibration = {}
		calibration['eyeLeft'] = $scope.user.actualEyeLeft;
		calibration['eyeRight'] = $scope.user.actualEyeRight;

	    $http.put('/calibration/'+$scope.userID, calibration).
		success(function(data, status, headers, config) {
		  if (data.message){
		  	$scope.errorMsg =data.message;
		  	//$log.log(data.message);
		  }
		  else{
		  	$scope.init();
		  }

		}).
		error(function(data, status, headers, config) {
		  $scope.error("Error al conectar");
		});
		
	};
});