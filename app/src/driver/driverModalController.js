app.controller('driverModalController',['$scope','$uibModalInstance','driverService','record',function($scope,$uibModalInstance,driverService,record){
    'use strict';
    $scope.driver={};
    $scope.driver.joinDate=new Date();
    $scope.calendar=false;
    $scope.loading=false;
	$scope.openCalendar=function() {
         $scope.calendar= true;
    };
    $scope.closeModal=function(){
        $uibModalInstance.close();
    };
    $scope.submitRequest=function(){
        $scope.loading=true;
        driverService.addDriver($scope.driver).then(function(res){
            $scope.loading=false;
            $scope.closeModal();
        });
    };
}]);