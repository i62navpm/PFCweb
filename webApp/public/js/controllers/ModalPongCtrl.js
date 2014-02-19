'use strict';

var ModalPongCtrl = function ($scope, $modal, $log) {

  $scope.items = ['item1', 'item2', 'item3'];

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
  $scope.open = function () {

    var modalInstance = $modal.open({
      templateUrl: 'modalPongContent.html',
      controller: ModalInstanceCtrl,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };
};

var ModalInstanceCtrl = function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
};