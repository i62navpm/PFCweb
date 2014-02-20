'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('dataController', function ($scope, $http, $log) {
	
	$scope.submit = function () {
		var data = []
		
		if ($scope.form.nif.$viewValue)
			data.push({nif: $scope.form.nif.$viewValue});
		if ($scope.form.name.$viewValue)
			data.push({name:$scope.form.name.$viewValue});
		if ($scope.form.address.$viewValue)
			data.push({address: $scope.form.address.$viewValue});
		if ($scope.form.phone.$viewValue)
			data.push({phone: $scope.form.phone.$viewValue});
		if ($scope.form.email.$viewValue)
			data.push({email: $scope.form.email.$viewValue});
		if ($scope.form.password.$viewValue)
			data.push({password: $scope.form.password.$viewValue});
		if ($scope.form.oldPassword.$viewValue)
			data.push({oldPassword: $scope.form.oldPassword.$viewValue});

		$http.put('/profile/'+$scope.userID, data).
		success(function(data, status, headers, config) {
		  $log.log(data);
		}).
		error(function(data, status, headers, config) {
		  $log.error("Error al conectar");
		});
	};
});