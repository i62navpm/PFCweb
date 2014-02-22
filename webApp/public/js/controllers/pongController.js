'use strict';
var webApp = angular.module('webApp.controllers');
 
webApp.controller('pongController', function ($scope, $http, $log) {

$scope.disabled = true;
$scope.changeOption = function () {
    if($scope.confPong == 'Fácil')
      $scope.disabled = true;
    else if($scope.confPong == 'Normal')
      $scope.disabled = true;
    else if($scope.confPong == 'Difícil')
      $scope.disabled = true;
    else
      $scope.disabled = false;
};

});