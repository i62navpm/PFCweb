'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('tetrisConfigController', function ($scope, $http, $log, $location) {

	$scope.submit = function(){
		var data = {};

		data.name=$scope.confName;
		data.board = {};
			data.board.backgroundColor = $scope.backgroundColorTetris;
			data.board.lineColor = $scope.lineColorTetris;
			data.board.textColor = $scope.textColorTetris;
			data.board.colNumber = $scope.colNumberTetris;
			data.board.rowNumber = $scope.rowNumberTetris;
		data.pieces = {};
			data.pieces.pieceSpeed = $scope.pieceSpeedTetris;
		data.difficult = {};
			data.difficult.points = $scope.pointsTetris;
			data.difficult.incPieceSpeed = $scope.incPieceSpeedTetris;

		$log.log("EEEOOO");
		$log.log(data);

		$http.post('/tetrisConfiguration/'+$scope.userID, data).
		success(function(data, status, headers, config) {
		  if (data.message){
		  	$scope.errorMsg =data.message;
		  	$log.log(data.message);
		  }
		  else{
		  	$scope.init();
		  	$location.path('/').replace();
		  }

		}).
		error(function(data, status, headers, config) {
		  $scope.error("Error al conectar");
		});
	
	}
});