'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('tetrisModifyConfController', function ($scope, $http, $log, $location) {

	$scope.submit = function(){
		var data = {};

		data.name=$scope.user.actualTetris.name;
		data._id=$scope.user.actualTetris._id;
		data.board = {};
			data.board.backgroundColor = $scope.user.actualTetris.board.backgroundColor;
			data.board.lineColor = $scope.user.actualTetris.board.lineColor;
			data.board.textColor = $scope.user.actualTetris.board.textColor;
			data.board.colNumber = $scope.user.actualTetris.board.colNumber;
			data.board.rowNumber = $scope.user.actualTetris.board.rowNumber;
		data.pieces = {};
			data.pieces.pieceSpeed = $scope.user.actualTetris.pieces.pieceSpeed;
		data.difficult = {};
			data.difficult.points = $scope.user.actualTetris.difficult.points;
			data.difficult.incPieceSpeed = $scope.user.actualTetris.difficult.incPieceSpeed;

		//$log.log(data);
		$http.put('/tetrisConfiguration/'+$scope.userID, data).
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
	
	}
});