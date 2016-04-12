app.controller('packageModalController',
               ['$scope','$rootScope','$uibModalInstance','packageService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,packageService,messageService,record){
    'use strict';
    $scope.package=angular.copy(record.data);
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
            packageService.addPackage('{"name":"'+$scope.type+'"}',$scope.package).then(function(){
               $scope.closeModal();
               packageService.package[$scope.type]=null;
               $rootScope.$emit($scope.type+'Package');
               messageService.showMessage({
                    'type':'success',
                    'title':'Package',
                    'text':'New '+$scope.type+' package added successfully.'
               });
            },function(){
                messageService.showMessage({
                    'type':'error',
                    'title':'Package',
                    'text':$scope.type+' package not added successfully. Please try again.'
                });
            });
        }else{
            delete $scope.package._id;
            packageService.updatePackage('{"name":"'+$scope.type+'"}',$scope.package).then(function(){
                $scope.closeModal();
                packageService.package[$scope.type]=null;
                $rootScope.$emit($scope.type+'Package');
                messageService.showMessage({
                    'type':'success',
                    'title':'Package',
                    'text':'New '+$scope.type+' package updated successfully.'
                });
            },function(err){
                messageService.showMessage({
                    'type':'error',
                    'title':'Package',
                    'text':$scope.type+' package not updated successfully. Please try again.'
                });
            });
        }        
    };
}]);