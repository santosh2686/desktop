app.controller('driverExpenseController',['$scope','expenseService','requestService','driverService','$uibModal',
                                          function($scope,expenseService,requestService,driverService,$uibModal){
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
    $scope.newExpense=function(){
        $uibModal.open({
          templateUrl: 'expense/driver/add-driver-expense.html',
          controller: 'addDriverExpenseController',
          size: 'lg',
          resolve:{
            record:function(){
                return {
                    'action':'new',
                    'data':{}
                };
            }
          }
      });
    }
}]);