app.controller('deleteConfirmationController',['$scope','message','$uibModalInstance',function($scope,message,$uibModalInstance){
  $scope.closeModal=function(){
    $uibModalInstance.close(false);
  };
  $scope.onConfirm = function () {
    $uibModalInstance.close(true);
  };
}]);