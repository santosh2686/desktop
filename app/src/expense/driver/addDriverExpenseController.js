app.controller('addDriverExpenseController',
               ['$scope','$rootScope','$filter','$uibModalInstance','expenseService','driverService','messageService','record',
               function($scope,$rootScope,$filter,$uibModalInstance,expenseService,driverService,messageService,record){
    
    $scope.expense=angular.copy(record.data);
    $scope.action=record.action;
    $scope.expense.date=$scope.action==='new'?new Date():new Date($scope.expense.date);
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
    driverService.getDriver().then(function(res){
        $scope.driverList=res.data;
        if(!driverService.driver){
            driverService.driver=res.data;
        }
    });
    $scope.submitRequest=function(){
        $scope.expense.month=$filter('date')($scope.expense.date,"MMM");
        $scope.expense.year=$filter('date')($scope.expense.date,"yyyy");
        $scope.loading=true;
        if($scope.action==='new'){
            expenseService.addExpense('driverExpense',$scope.expense).then(function(){
               $scope.closeModal();
               expenseService.expense.driverExpense=null;
               $rootScope.$emit('driverExpense');
               messageService.showMessage({
                    'type':'success',
                    'title':'Driver Expense',
                    'text':'New driver expense added successfully.'
               });
            },function(){
                messageService.showMessage({
                    'type':'error',
                    'title':'Driver Expense',
                    'text':'Driver expense not added successfully. Please try again.'
                });
            });
        }else{
            delete $scope.expense._id;
            expenseService.updateExpense('driverExpense',recordId,$scope.expense).then(function(){
                $scope.closeModal();
                expenseService.expense.driverExpense=null;
                $rootScope.$emit('driverExpense');
                messageService.showMessage({
                    'type':'success',
                    'title':'driver Expense',
                    'text':'Driver expense updated successfully.'
                });
            },function(err){
                messageService.showMessage({
                    'type':'error',
                    'title':'Driver Expense',
                    'text':'Driver expense not updated successfully. Please try again.'
                });
            });
        }        
    };             
    
}]);