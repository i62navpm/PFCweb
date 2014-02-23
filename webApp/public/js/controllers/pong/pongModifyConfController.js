'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('pongModifyConfController', function ($scope, $http, $log, $location) {

	$scope.submit = function(){
		var data = {};

		data.name=$scope.user.actualPong.name;
		data._id=$scope.user.actualPong._id;
		data.board = {};
			data.board.backgroundColor = $scope.user.actualPong.board.backgroundColor;
			data.board.lineColor = $scope.user.actualPong.board.lineColor;
			data.board.raquetColor = $scope.user.actualPong.board.raquetColor;
			data.board.textColor = $scope.user.actualPong.board.textColor;
			data.board.numberZone = $scope.user.actualPong.board.numberZone;
		data.pieces = {};
			data.pieces.leftSpeed = $scope.user.actualPong.pieces.leftSpeed;
			data.pieces.rightSpeed = $scope.user.actualPong.pieces.rightSpeed;
			data.pieces.ballSpeed = $scope.user.actualPong.pieces.ballSpeed;
			data.pieces.raquetWidth = $scope.user.actualPong.pieces.raquetWidth;
			data.pieces.raquetHeight = $scope.user.actualPong.pieces.raquetHeight;
		data.difficult = {};
			data.difficult.goals = $scope.user.actualPong.difficult.goals;
			data.difficult.points = $scope.user.actualPong.difficult.points;
			data.difficult.incBallSpeed = $scope.user.actualPong.difficult.incBallSpeed;
			data.difficult.incOpSpeed = $scope.user.actualPong.difficult.incOpSpeed;

		$log.log(data);
		$http.put('/pongConfiguration/'+$scope.userID, data).
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