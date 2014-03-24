'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('scoreController', function ($scope, $http, $log, $location) {
	$scope.selectScoreGame = 'Pong';
	$scope.actualScoreGame = $scope.user.pongConf;
	$scope.idGame = '1';

	$scope.title = ['Fecha', 'Puntos', 'Nivel', 'Marcador Oponente', 'Marcador Jugador']
	
	$scope.chartConfig = {
        options: {
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },

        yAxis: {
                title: {
                    text: 'Puntos'
                },
                min: 0
            },
        xAxis: {
                title: {
                    text: 'Partidas'
                },
                min: 0
            },

        series: [],

        title: {
            text: 'Resultados de puntuación'
        },
        credits: {
            enabled: false
        },
        loading: false
    }

    $scope.chartConfig2 = {
        options: {
            chart: {
                type: 'spline',
                zoomType: 'xy'
            },
            plotOptions: {
                series: {
                    stacking: ''
                }
            }
        },
        yAxis: {
                title: {
                    text: 'Puntos'
                },
                min: 0
            },
        xAxis: {
                title: {
                    text: 'Partidas'
                },
                min: 0
            },

        series: [],

        title: {
            text: 'Marcadores'
        },
        credits: {
            enabled: false
        },
        loading: false
    }

	$scope.changeGame = function(){
		$scope.chartConfig.series = [];
		$scope.chartConfig2.series = [];
		$scope.actualConf = null;
		$scope.idGame = '1';
		
		if($scope.selectScoreGame == 'Pong'){
			$scope.actualScoreGame = $scope.user.pongConf;
			$scope.title = ['Fecha', 'Puntos', 'Nivel', 'Marcador Oponente', 'Marcador Jugador'];
		}
		else if($scope.selectScoreGame == 'Tetris'){
			$scope.actualScoreGame = $scope.user.tetrisConf;
			$scope.title = ['Fecha', 'Puntos', 'Nivel'];
		}
		else if($scope.selectScoreGame == 'DragMe'){
			$scope.actualScoreGame = $scope.user.dragMeConf;
			$scope.title = ['Fecha', 'Tiempos'];
		}
		
	};

	$scope.changeConf = function(){
		//$log.log($scope.idGame);
		$scope.actualConf = [];
		$scope.chartConfig2.series = [];
		for(var i in $scope.actualScoreGame){
			if($scope.actualScoreGame[i]._id == $scope.idGame){
				
				var aux = $scope.actualScoreGame[i].score;

				var vectorPoints = [];
				var vectorLevel = [];
				var vectorLines = [];
				var vectorTimes = [];
				var vectorOpponentScore = [];
				var vectorPlayerScore = [];
				if($scope.selectScoreGame == 'Pong'){
					for(var j in aux){
						$scope.actualConf [j] = {};
						var date = new Date(aux[j]['date']);	
						$scope.actualConf[j]['1'] = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+"-"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
						$scope.actualConf[j]['2'] = aux[j]['points'];
						$scope.actualConf[j]['3'] = aux[j]['level'];
						$scope.actualConf[j]['4'] = aux[j]['opponentScore'];
						$scope.actualConf[j]['5'] = aux[j]['playerScore'];
						vectorPoints.push(parseInt(aux[j]['points']));
						vectorLevel.push(parseInt(aux[j]['level']));
						vectorOpponentScore.push(parseInt(aux[j]['opponentScore']));
						vectorPlayerScore.push(parseInt(aux[j]['playerScore']));
					};
				$scope.chartConfig.series = [
					{name: 'Puntos', data: vectorPoints},
			        {name: 'Nivel', data: vectorLevel}];
		        $scope.chartConfig2.series = [
			        {name: 'MarcadorOponente', data: vectorOpponentScore},
			        {name: 'MarcadorJugador', data: vectorPlayerScore}];

				
				
				};
				if($scope.selectScoreGame == 'Tetris'){
					for(var j in aux){
						$scope.actualConf [j] = {};
						var date = new Date(aux[j]['date']);	
						$scope.actualConf[j]['1'] = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+"-"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
						$scope.actualConf[j]['2'] = aux[j]['lines'];
						$scope.actualConf[j]['3'] = aux[j]['level'];
						vectorLines.push(parseInt(aux[j]['lines']));
						vectorLevel.push(parseInt(aux[j]['level']));
					};
					$scope.chartConfig.series = [
					{name: 'Puntos', data: vectorLines},
			        {name: 'Nivel', data: vectorLevel}];
				};
				if($scope.selectScoreGame == 'DragMe'){
					for(var j in aux){
						$scope.actualConf [j] = {};
						var date = new Date(aux[j]['date']);
						var rest = aux[j]['times'].split(':');
						var sec = parseFloat(rest[0])*60;
						sec+=parseFloat(rest[1])*60;
						sec+=parseFloat(rest[2]) + parseFloat(rest[3])/1000;
						
						$scope.actualConf[j]['1'] = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+"-"+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
						$scope.actualConf[j]['2'] = aux[j]['times'];
						//$log.log(sec);
						vectorTimes.push(parseFloat(sec));
						
					};
					$scope.chartConfig.series = [
					{name: 'Tiempos', data: vectorTimes}];
				};
				break;
			};
		};
		//$log.log($scope.actualConf);
		//$log.log($scope.actualScoreGame[i].score);
	};

});