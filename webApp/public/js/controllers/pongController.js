'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('pongController', function ($scope, $http, $log, $location) {

$scope.disabled = true;

$scope.changeOption = function () {
    if($scope.confPong == 'Fácil'){
      $scope.disabled = true;
      $scope.user.actualPong = $scope.pongEasy;
    }
    else if($scope.confPong == 'Normal'){
      $scope.disabled = true;
      $scope.user.actualPong = $scope.pongNormal;
    }
    else if($scope.confPong == 'Difícil'){
      $scope.disabled = true;
      $scope.user.actualPong = $scope.pongHard;
    }
    else
      $scope.disabled = false;


  for(var i in $scope.user.pongConf)
  	if($scope.user.pongConf[i]._id == $scope.confPong){
  		$scope.user.actualPong = $scope.user.pongConf[i];
  		break;
  	};
  $log.log($scope.user.actualPong);
};

$scope.deleteConfPong = function(){  
  var data = $scope.user.actualPong._id;
  $http.delete('/pongConfiguration/'+$scope.userID+'/'+$scope.user.actualPong._id).
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

$scope.pongEasy={
    name    :   'Fácil',
    board   :{
        backgroundColor : '#ffffff',
        lineColor       : '#000000',
        raquetColor     : '#000000',
        textColor       : '#000000',
        numberZone      : '5'
    },
    pieces  :{
        leftSpeed       : '5',
        rightSpeed      : '5',
        ballSpeed       : '5',
        raquetWidth     : '10',
        raquetHeight    : '80'
    },
    difficult   :{
        goals           : '5',
        points          : '10',
        incBallSpeed    : '1',
        incOpSpeed      : '0.5'
    }
};
$scope.pongNormal={
    name    :   'Normal',
    board   :{
        backgroundColor : '#ffffff',
        lineColor       : '#000000',
        raquetColor     : '#000000',
        textColor       : '#000000',
        numberZone      : '5'
    },
    pieces  :{
        leftSpeed       : '5',
        rightSpeed      : '5',
        ballSpeed       : '5',
        raquetWidth     : '10',
        raquetHeight    : '80'
    },
    difficult   :{
        goals           : '5',
        points          : '10',
        incBallSpeed    : '2',
        incOpSpeed      : '1'
    }
};
$scope.pongHard={
    name    :   'Difícil',
    board   :{
        backgroundColor : '#ffffff',
        lineColor       : '#000000',
        raquetColor     : '#000000',
        textColor       : '#000000',
        numberZone      : '5'
    },
    pieces  :{
        leftSpeed       : '5',
        rightSpeed      : '5',
        ballSpeed       : '5',
        raquetWidth     : '10',
        raquetHeight    : '80'
    },
    difficult   :{
        goals           : '5',
        points          : '10',
        incBallSpeed    : '3',
        incOpSpeed      : '2.5'
    }
};
$scope.user.actualPong = $scope.pongEasy;
$log.log($scope.user.actualPong);
});