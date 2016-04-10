app.controller('packageModalController',
               ['$scope','$rootScope','$uibModalInstance','packageService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,packageService,messageService,record){
    'use strict';
    $scope.package=angular.copy(record.data);
    $scope.action=record.action;
    if($scope.action==='edit'){
        var recordId = $scope.package._id; 
    }
    $scope.loading=false;
    $scope.hideView=($scope.action==='view');
    $scope.closeModal=function(){
        $uibModalInstance.close();
    };
    $scope.submitRequest=function(){
        $scope.loading=true;
        if(record.action==='new'){
            packageService.addPackage($scope.package).then(function(){
               $scope.closeModal();
               packageService.package=null;
               $rootScope.$emit('package');
               messageService.showMessage({
                    'type':'success',
                    'title':'Driver',
                    'text':'New driver added successfully.'
               });
            },function(){
                messageService.showMessage({
                    'type':'error',
                    'title':'Driver',
                    'text':'Driver not added successfully. Please try again.'
                });
            });
        }else{
            delete $scope.package._id;
            packageService.updatePackage(recordId,$scope.driver).then(function(){
                $scope.closeModal();
                packageService.driver=null;
                $rootScope.$emit('package');
                messageService.showMessage({
                    'type':'success',
                    'title':'Driver',
                    'text':'Driver updated successfully.'
                });
            },function(err){
                messageService.showMessage({
                    'type':'error',
                    'title':'Driver',
                    'text':'Driver not updated successfully. Please try again.'
                });
            });
        }        
    };
}]);