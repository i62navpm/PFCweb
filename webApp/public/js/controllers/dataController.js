'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('dataController', function ($scope, $http, $log, $location) {
	$scope.submit = function () {
		var data = {}
		
		if ($scope.form.nif.$viewValue)
			data['nif'] = $scope.form.nif.$viewValue;
		if ($scope.form.name.$viewValue)
			data['userName'] = $scope.form.name.$viewValue;
		if ($scope.form.address.$viewValue)
			data['address'] = $scope.form.address.$viewValue;
		if ($scope.form.phone.$viewValue)
			data['phone'] = $scope.form.phone.$viewValue;
		if ($scope.form.email.$viewValue)
			data['email'] = $scope.form.email.$viewValue;
		if ($scope.form.password.$viewValue)
			data['password'] = $scope.form.password.$viewValue;
		if ($scope.form.oldPassword.$viewValue)
			data['oldPassword'] = $scope.form.oldPassword.$viewValue;

		$http.put('/profile/'+$scope.userID, data).
		success(function(data, status, headers, config) {
		  if (data.message){
		  	$scope.errorMsg =data.message;
		  	//$log.log(data.message);
		  }
		  else{
		  	$scope.init();
		  	$location.path('/').replace();
		  }

		}).
		error(function(data, status, headers, config) {
		  $scope.error("Error al conectar");
		});
	};
});