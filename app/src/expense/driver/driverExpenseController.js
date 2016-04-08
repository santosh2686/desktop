app.controller('driverExpenseController',['$scope','expenseService','requestService','driverService',function($scope,expenseService,requestService,driverService){
    $scope.data=[];
	$scope.loading=true;
    var pagination=function(){
		$scope.loading=false;
		$scope.totalItems=$scope.data.length;
		$scope.currentPage=requestService.request.pager.currentPage;
		$scope.itemsPerPage=requestService.request.pager.itemsPerPage;
		$scope.maxSize=requestService.request.pager.maxSize;
	},
    success=function(res){
		$scope.data=res.data;
		if(!expenseService.expense.driverExpense){
            expenseService.expense.driverExpense=res.data;
        }
        $scope.loading=false;
        pagination();
	};
    driverService.getDriver().then(function(res){
        $scope.driverList=res.data;
        if(!driverService.driver){
            driverService.driver=res.data;
        }
    });
    expenseService.getExpense('driverExpense').then(success);
}]);