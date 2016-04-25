app.controller('addDriverExpenseController',['$scope','expenseService','driverService',function($scope,expenseService,driverService){
     $scope.expense={
    }
    $scope.calendar={};
    $scope.openCalendar=function(){
        $scope.calendar.open=true;    
    }
    driverService.getDriver().then(function(res){
        $scope.driverList=res.data;
        if(!driverService.driver){
            driverService.driver=res.data;
        }
    });
    
}]);