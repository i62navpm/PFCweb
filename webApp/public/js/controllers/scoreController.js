'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('scoreController', function ($scope, $http, $log, $location) {
	$scope.selectScoreGame = 'Pong';
	$scope.actualScoreGame = $scope.user.pongConf;

	$scope.title = ['Fecha', 'Puntos', 'Nivel', 'Marcador Oponente', 'Marcador Jugador']

	$scope.changeGame = function(){
		if($scope.selectScoreGame == 'Pong'){
			$scope.actualScoreGame = $scope.user.pongConf;
			$scope.title = ['Fecha', 'Puntos', 'Nivel', 'Marcador Oponente', 'Marcador Jugador'];
		}
		else if($scope.selectScoreGame == 'Tetris'){
			$scope.actualScoreGame = $scope.user.tetrisConf;
			$scope.title = ['Fecha', 'Líneas', 'Nivel'];
		}
		else if($scope.selectScoreGame == 'DragMe'){
			$scope.actualScoreGame = $scope.user.dragMeConf;
			$scope.title = ['Fecha', 'Tiempo'];
		}
		
	}

});