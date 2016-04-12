app.controller('vehicleModalController',
               ['$scope','$rootScope','$uibModalInstance','vehicleService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,vehicleService,messageService,record){
    'use strict';
    $scope.vehicle=angular.copy(record.data);
    $scope.action=record.action;
    $scope.type=record.type;
    $scope.loading=false;
    $scope.hideView=($scope.action==='view');
    $scope.closeModal=function(){
        $uibModalInstance.close();
    };
    $scope.submitRequest=function(){
        $scope.loading=true;
        if(record.action==='new'){
            vehicleService.addVehicle('{"name":"'+$scope.type+'"}',$scope.vehicle).then(function(){
               $scope.closeModal();
               vehicleService.vehicle[$scope.type]=null;
               $rootScope.$emit($scope.type+'Vehicle');
               messageService.showMessage({
                    'type':'success',
                    'title':'Vehicle',
                    'text':'New '+$scope.type+' vehicle added successfully.'
               });
            },function(){
                messageService.showMessage({
                    'type':'error',
                    'title':'Vehicle',
                    'text':$scope.type+' vehicle not added successfully. Please try again.'
                });
            });
        }else{
            vehicleService.updateVehicle('{"name":"'+$scope.type+'","data._id":"'+$scope.vehicle._id+'"}',$scope.vehicle)
            .then(function(){
                $scope.closeModal();
                vehicleService.vehicle[$scope.type]=null;
                $rootScope.$emit($scope.type+'Vehicle');
                messageService.showMessage({
                    'type':'success',
                    'title':'Vehicle',
                    'text':'New '+$scope.type+' vehicle updated successfully.'
                });
            },function(err){
                messageService.showMessage({
                    'type':'error',
                    'title':'Vehicle',
                    'text':$scope.type+' vehicle not updated successfully. Please try again.'
                });
            });
        }        
    };
}]);