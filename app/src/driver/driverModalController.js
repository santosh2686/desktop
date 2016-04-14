app.controller('driverModalController',
               ['$scope','$rootScope','$uibModalInstance','driverService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,driverService,messageService,record){
    'use strict';
    $scope.driver=angular.copy(record.data);
    $scope.action=record.action;
    $scope.driver.joinDate=$scope.action==='new'?new Date():new Date($scope.driver.joinDate);
    if($scope.action==='edit'){
        var recordId = $scope.driver._id; 
    }
    $scope.calendar={
        open:false
    };
    $scope.loading=false;
    $scope.hideView=($scope.action==='view');    
	$scope.openCalendar=function(){
         $scope.calendar.open=true;
    };
    $scope.closeModal=function(){
        $uibModalInstance.close();
    };
    $scope.submitRequest=function(){
        $scope.loading=true;
        if(record.action==='new'){
            driverService.addDriver($scope.driver).then(function(){
               $scope.closeModal();
               driverService.driver=null;
               $rootScope.$emit('driver');
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
            delete $scope.driver._id;
            driverService.updateDriver(recordId,$scope.driver).then(function(){
                $scope.closeModal();
                driverService.driver=null;
                $rootScope.$emit('driver');
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