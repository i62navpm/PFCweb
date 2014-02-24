'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('gamesController', function ($scope, $http, $log, $location) {

$scope.disabledPong = true;
$scope.confPong = '1';
$scope.user.actualPong = null;

$scope.changeOptionPong = function () {
  for(var i in $scope.user.pongConf)
  	if($scope.user.pongConf[i]._id == $scope.confPong){
  		$scope.user.actualPong = $scope.user.pongConf[i];
  		if($scope.user.actualPong.name == 'Fácil'){
        $scope.disabledPong = true;
      }
      else if($scope.user.actualPong.name == 'Normal'){
        $scope.disabledPong = true;
      }
      else if($scope.user.actualPong.name == 'Difícil'){
        $scope.disabledPong = true;
      }
      else{
        $scope.disabledPong = false;
      }
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
        $scope.confPong = '1';
        $scope.user.actualPong = null;
      }

    }).
    error(function(data, status, headers, config) {
      $scope.error("Error al conectar");
  }); 
}

$scope.playPong = function(){
  
  $http.get('/playPong/'+$scope.userID+'/'+$scope.user.actualPong._id);
}



$scope.disabledTetris = true;
$scope.confTetris = '1';
$scope.user.actualTetris = null;

$scope.changeOptionTetris = function () {
  for(var i in $scope.user.tetrisConf)
    if($scope.user.tetrisConf[i]._id == $scope.confTetris){
      $scope.user.actualTetris = $scope.user.tetrisConf[i];
      if($scope.user.actualTetris.name == 'Fácil'){
        $scope.disabledTetris = true;
      }
      else if($scope.user.actualTetris.name == 'Normal'){
        $scope.disabledTetris = true;
      }
      else if($scope.user.actualTetris.name == 'Difícil'){
        $scope.disabledTetris = true;
      }
      else{
        $scope.disabledTetris = false;
      }
      break;
    };
  $log.log($scope.user.actualTetris);
};

$scope.deleteConfTetris = function(){  
  var data = $scope.user.actualTetris._id;
  $http.delete('/tetrisConfiguration/'+$scope.userID+'/'+$scope.user.actualTetris._id).
    success(function(data, status, headers, config) {
      if (data.message){
        $scope.errorMsg =data.message;
        $log.log(data.message);
      }
      else{
        $scope.init();
        $location.path('/').replace();
        $scope.confTetris = '1';
        $scope.user.actualTetris = null;
      }

    }).
    error(function(data, status, headers, config) {
      $scope.error("Error al conectar");
  }); 
}



$scope.disabledDragMe = true;
$scope.confDragMe = '1';
$scope.user.actualDragMe = null;

$scope.changeOptionDragMe = function () {
  for(var i in $scope.user.dragMeConf)
    if($scope.user.dragMeConf[i]._id == $scope.confDragMe){
      $scope.user.actualDragMe = $scope.user.dragMeConf[i];
      if($scope.user.actualDragMe.name == 'Fácil'){
        $scope.disabledDragMe = true;
      }
      else if($scope.user.actualDragMe.name == 'Normal'){
        $scope.disabledDragMe = true;
      }
      else if($scope.user.actualDragMe.name == 'Difícil'){
        $scope.disabledDragMe = true;
      }
      else{
        $scope.disabledDragMe = false;
      }
      break;
    };
  $log.log($scope.user.actualDragMe);
};

$scope.deleteConfDragMe = function(){  
  var data = $scope.user.actualDragMe._id;
  $http.delete('/dragMeConfiguration/'+$scope.userID+'/'+$scope.user.actualDragMe._id).
    success(function(data, status, headers, config) {
      if (data.message){
        $scope.errorMsg =data.message;
        $log.log(data.message);
      }
      else{
        $scope.init();
        $location.path('/').replace();
        $scope.confDragMe = '1';
        $scope.user.actualDragMe = null;
      }

    }).
    error(function(data, status, headers, config) {
      $scope.error("Error al conectar");
  }); 
}

});