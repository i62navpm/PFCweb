'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('dragMeModifyConfController', function ($scope, $http, $log, $location) {

	$scope.submit = function(){
		var data = {};

		data.name=$scope.user.actualDragMe.name;
		data._id=$scope.user.actualDragMe._id;
		data.board = {};
			data.board.backgroundInColor = $scope.user.actualDragMe.board.backgroundInColor;
			data.board.backgroundOutColor = $scope.user.actualDragMe.board.backgroundOutColor;
			data.board.textColor = $scope.user.actualDragMe.board.textColor;
		data.pieces = {};
			data.pieces.opponentSpeed = $scope.user.actualDragMe.pieces.opponentSpeed;
			data.pieces.playerSize = $scope.user.actualDragMe.pieces.playerSize;
		data.difficult = {};
			data.difficult.timePieceSpeed = $scope.user.actualDragMe.difficult.timePieceSpeed;
			data.difficult.incPieceSpeed = $scope.user.actualDragMe.difficult.incPieceSpeed;

		$log.log(data);
		$http.put('/dragMeConfiguration/'+$scope.userID, data).
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