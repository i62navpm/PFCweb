'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('dragMeConfigController', function ($scope, $http, $log, $location) {

	$scope.submit = function(){
		var data = {};

		data.name=$scope.confName;
		data.board = {};
			data.board.backgroundInColor = $scope.backgroundInColorDragMe;
			data.board.backgroundOutColor = $scope.backgroundOutColorDragMe;
			data.board.textColor = $scope.textColorDragMe;
		data.pieces = {};
			data.pieces.opponentSpeed = $scope.opponentSpeedDragMe;
			data.pieces.playerSize = $scope.playerSizeDragMe;
		data.difficult = {};
			data.difficult.timePieceSpeed = $scope.timePieceSpeedDragMe;
			data.difficult.incPieceSpeed = $scope.incPieceSpeedDragMe;

		//$log.log("EEEOOO");
		//$log.log(data);

		$http.post('/dragMeConfiguration/'+$scope.userID, data).
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