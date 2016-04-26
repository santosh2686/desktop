app.controller('addVehicleExpenseController',
               ['$scope','$rootScope','$filter','$uibModalInstance','expenseService','vehicleService','messageService','record',
               function($scope,$rootScope,$filter,$uibModalInstance,expenseService,vehicleService,messageService,record){
    
    $scope.expense=angular.copy(record.data);
    $scope.action=record.action;
    $scope.expense.date=$scope.action==='new'?new Date():new Date($scope.expense.date);
    if($scope.action==='new'){
        $scope.expense.paymentMode="cash";    
    }
    if($scope.action==='edit'){
        var recordId = $scope.expense._id; 
    };
    $scope.loading=false;
    $scope.hideView=($scope.action==='view');  
    $scope.calendar={};
    $scope.openCalendar=function(){
        $scope.calendar.open=true;    
    }
    $scope.closeModal=function(){
        $uibModalInstance.close();
    };
    vehicleService.getVehicle('own').then(function(res){
        $scope.vehicleList=res.data[0].data;
        if(!vehicleService.vehicle.own){
            vehicleService.vehicle.own=res.data;
        }
    });
    $scope.submitRequest=function(){
        $scope.expense.month=$filter('date')($scope.expense.date,"MMM");
        $scope.expense.year=$filter('date')($scope.expense.date,"yyyy");
        $scope.loading=true;
        if($scope.action==='new'){            
            expenseService.addExpense('vehicleExpense',$scope.expense).then(function(){
               $scope.closeModal();
               expenseService.expense.vehicleExpense=null;
               $rootScope.$emit('vehicleExpense');
               messageService.showMessage({
                    'type':'success',
                    'title':'Vehicle Expense',
                    'text':'New vehicle expense added successfully.'
               });
            },function(){
                messageService.showMessage({
                    'type':'error',
                    'title':'Vehicle Expense',
                    'text':'Vehicle expense not added successfully. Please try again.'
                });
            });
        }else{
            delete $scope.expense._id;
            expenseService.updateExpense('vehicleExpense',recordId,$scope.expense).then(function(){
                $scope.closeModal();
                expenseService.expense.vehicleExpense=null;
                $rootScope.$emit('vehicleExpense');
                messageService.showMessage({
                    'type':'success',
                    'title':'Vehicle Expense',
                    'text':'Vehicle expense updated successfully.'
                });
            },function(err){
                messageService.showMessage({
                    'type':'error',
                    'title':'Vehicle Expense',
                    'text':'Vehicle expense not updated successfully. Please try again.'
                });
            });
        }        
    };             
    
}]);