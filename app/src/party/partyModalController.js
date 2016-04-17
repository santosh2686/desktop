app.controller('partyModalController',
               ['$scope','$rootScope','$uibModalInstance','partyService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,partyService,messageService,record){
    'use strict';
    $scope.party=angular.copy(record.data);
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
            partyService.addParty('{"name":"'+$scope.type+'"}',$scope.party).then(function(){
               $scope.closeModal();
               partyService.party[$scope.type]=null;
               $rootScope.$emit($scope.type+'Party');
               messageService.showMessage({
                    'type':'success',
                    'title':'Party',
                    'text':'New '+$scope.type+' party added successfully.'
               });
            },function(){
                messageService.showMessage({
                    'type':'error',
                    'title':'Party',
                    'text':$scope.type+' party not added successfully. Please try again.'
                });
            });
        }else{
            partyService.updateParty('{"name":"'+$scope.type+'","data._id":"'+$scope.party._id+'"}',$scope.party)
            .then(function(){
                $scope.closeModal();
                partyService.party[$scope.type]=null;
                $rootScope.$emit($scope.type+'Party');
                messageService.showMessage({
                    'type':'success',
                    'title':'Party',
                    'text':'New '+$scope.type+' party updated successfully.'
                });
            },function(err){
                messageService.showMessage({
                    'type':'error',
                    'title':'Party',
                    'text':$scope.type+' party not updated successfully. Please try again.'
                });
            });
        }        
    };
}]);