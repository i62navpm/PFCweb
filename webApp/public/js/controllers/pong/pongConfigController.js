'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('pongConfigController', function ($scope, $http, $log, $location) {

	$scope.submit = function(){
		var data = {};

		data.name=$scope.confName;
		data.board = {};
			data.board.backgroundColor = $scope.backgroundColorPong;
			data.board.lineColor = $scope.lineColorPong;
			data.board.raquetColor = $scope.raquetColorPong;
			data.board.textColor = $scope.textColorPong;
			data.board.numberZone = $scope.numberZonePong;
		data.pieces = {};
			data.pieces.leftSpeed = $scope.leftSpeedPong;
			data.pieces.rightSpeed = $scope.rightSpeedPong;
			data.pieces.ballSpeed = $scope.ballSpeedPong;
			data.pieces.raquetWidth = $scope.raquetWidthPong;
			data.pieces.raquetHeight = $scope.raquetHeightPong;
		data.difficult = {};
			data.difficult.goals = $scope.goalsPong;
			data.difficult.points = $scope.pointsPong;
			data.difficult.incBallSpeed = $scope.incBallSpeedPong;
			data.difficult.incOpSpeed = $scope.incOpSpeedPong;

		$http.post('/pongConfiguration/'+$scope.userID, data).
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