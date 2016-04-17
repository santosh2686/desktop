app.controller('vehicleModalController',
               ['$scope','$rootScope','$uibModalInstance','vehicleService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,vehicleService,messageService,record){
    'use strict';
    $scope.vehicleView=true;
    var currDate=new Date();
    $scope.vehicle=angular.copy(record.data);
    $scope.action=record.action;
    $scope.type=record.type;
    $scope.loading=false;
    $scope.hideView=$scope.action==='view';
                    
    if($scope.action==='new'){
        $scope.vehicle.vehicleType="Car";
        $scope.vehicle.AC='Yes';
        $scope.vehicle.selectLoan='No';
        $scope.vehicle.selectFixed='No';
        
       
        $scope.vehicle.fixed={
            'contractStartDate':currDate,
            'contractEndDate':currDate
        }
        if($scope.type==='own'){
            $scope.vehicle.loan={
                'loanDisbursementDate':currDate,
                'emiDate':currDate
            }
            $scope.vehicle.documents={
                'PUC':{
                    'startDate':currDate,
                    'endDate':currDate,
                    'amt':0
                },
                'tax':{
                    'startDate':currDate,
                    'endDate':currDate,
                    'amt':0
                },
                'passing':{
                    'startDate':currDate,
                    'endDate':currDate,
                    'amt':0
                },
                'permit':{
                    'startDate':currDate,
                    'endDate':currDate,
                    'amt':0
                },
                'authorization':{
                    'startDate':currDate,
                    'endDate':currDate,
                    'amt':0
                },
                'insurance':{
                    'startDate':currDate,
                    'endDate':currDate,
                    'amt':0
                }
            };
        }
    }
                    
    if($scope.action==='edit'){
        if($scope.vehicle.selectLoan=='Yes'){
           $scope.vehicle.loan.loanDisbursementDate=new Date($scope.vehicle.loan.loanDisbursementDate); 
           $scope.vehicle.loan.emiDate=new Date($scope.vehicle.loan.emiDate); 
        }
        if($scope.vehicle.selectFixed=='Yes'){
            $scope.vehicle.fixed.contractStartDate=new Date($scope.vehicle.fixed.contractStartDate);
            $scope.vehicle.fixed.contractEndDate=new Date($scope.vehicle.fixed.contractEndDate);
        }
        angular.forEach($scope.vehicle.documents,function(item){
            item.startDate=new Date(item.startDate);
            item.endDate=new Date(item.endDate);
        });
    }
    
    $scope.switchView=function(){
        $scope.vehicleView=!$scope.vehicleView;
    }
    
    $scope.calendar={}
    $scope.endCalendar={}
    $scope.openCalendar= function(type) {
         $scope.calendar[type]= true;
    };                    
    $scope.openEndCalendar= function(type) {
         $scope.endCalendar[type]= true;
    };   
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