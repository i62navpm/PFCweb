'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('gamesController', function ($scope, $http, $log, $location) {

$scope.disabledPong = true;

$scope.changeOptionPong = function () {
    if($scope.confPong == 'Fácil'){
      $scope.disabledPong = true;
      $scope.user.actualPong = $scope.pongEasy;
    }
    else if($scope.confPong == 'Normal'){
      $scope.disabledPong = true;
      $scope.user.actualPong = $scope.pongNormal;
    }
    else if($scope.confPong == 'Difícil'){
      $scope.disabledPong = true;
      $scope.user.actualPong = $scope.pongHard;
    }
    else
      $scope.disabledPong = false;


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

$scope.disabledTetris = true;

$scope.changeOptionTetris = function () {
    if($scope.confTetris == 'Fácil'){
      $scope.disabledTetris = true;
      $scope.user.actualTetris = $scope.tetrisEasy;
    }
    else if($scope.confTetris == 'Normal'){
      $scope.disabledTetris = true;
      $scope.user.actualTetris = $scope.tetrisNormal;
    }
    else if($scope.confTetris == 'Difícil'){
      $scope.disabledTetris = true;
      $scope.user.actualTetris = $scope.tetrisHard;
    }
    else
      $scope.disabledTetris = false;


  for(var i in $scope.user.tetrisConf)
    if($scope.user.tetrisConf[i]._id == $scope.confTetris){
      $scope.user.actualTetris = $scope.user.tetrisConf[i];
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
      }

    }).
    error(function(data, status, headers, config) {
      $scope.error("Error al conectar");
  }); 
}

$scope.tetrisEasy={
    name    :   'Fácil',
    board   :{
        backgroundColor : '#ffffff',
        lineColor       : '#000000',
        textColor       : '#000000',
        colNumber       : '10',
        rowNumber       : '15'

    },
    pieces  :{
        pieceSpeed      : '200'
    },
    difficult   :{
        points          : '10',
        incPieceSpeed   : '10'
    }
};
$scope.tetrisNormal={
    name    :   'Normal',
    board   :{
        backgroundColor : '#ffffff',
        lineColor       : '#000000',
        textColor       : '#000000',
        colNumber       : '10',
        rowNumber       : '15'

    },
    pieces  :{
        pieceSpeed      : '200'
    },
    difficult   :{
        points          : '10',
        incPieceSpeed   : '20'
    }
};
$scope.tetrisHard={
    name    :   'Difícil',
    board   :{
        backgroundColor : '#ffffff',
        lineColor       : '#000000',
        textColor       : '#000000',
        colNumber       : '10',
        rowNumber       : '15'

    },
    pieces  :{
        pieceSpeed      : '200'
    },
    difficult   :{
        points          : '10',
        incPieceSpeed   : '30'
    }
};
$scope.user.actualTetris = $scope.tetrisEasy;
$log.log($scope.user.actualTetris);

$scope.disabledDragMe = true;

$scope.changeOptionDragMe = function () {
    if($scope.confDragMe == 'Fácil'){
      $scope.disabledDragMe = true;
      $scope.user.actualDragMe = $scope.dragMeEasy;
    }
    else if($scope.confDragMe == 'Normal'){
      $scope.disabledDragMe = true;
      $scope.user.actualDragMe = $scope.dragMeNormal;
    }
    else if($scope.confDragMe == 'Difícil'){
      $scope.disabledDragMe = true;
      $scope.user.actualDragMe = $scope.dragMeHard;
    }
    else
      $scope.disabledDragMe = false;


  for(var i in $scope.user.dragMeConf)
    if($scope.user.dragMeConf[i]._id == $scope.confDragMe){
      $scope.user.actualDragMe = $scope.user.dragMeConf[i];
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
      }

    }).
    error(function(data, status, headers, config) {
      $scope.error("Error al conectar");
  }); 
}

$scope.dragMeEasy={
    name    :   'Fácil',
    board   :{
        backgroundInColor   : '#ffffff',
        backgroundOutColor  : '#000000',
        textColor       : '#000000'

    },
    pieces  :{
        opponentSpeed   : '5',
        playerSize      : '50'
    },
    difficult   :{
        timePieceSpeed  : '2',
        incPieceSpeed   : '4'
    }
};
$scope.dragMeNormal={
    name    :   'Normal',
    board   :{
        backgroundInColor   : '#ffffff',
        backgroundOutColor  : '#000000',
        textColor       : '#000000'

    },
    pieces  :{
        opponentSpeed   : '5',
        playerSize      : '50'
    },
    difficult   :{
        timePieceSpeed  : '2',
        incPieceSpeed   : '3'
    }
};
$scope.dragMeHard={
    name    :   'Difícil',
    board   :{
        backgroundInColor   : '#ffffff',
        backgroundOutColor  : '#000000',
        textColor       : '#000000'

    },
    pieces  :{
        opponentSpeed   : '5',
        playerSize      : '50'
    },
    difficult   :{
        timePieceSpeed  : '2',
        incPieceSpeed   : '2'
    }
};
$scope.user.actualDragMe = $scope.dragMeEasy;
$log.log($scope.user.actualDragMe);

});