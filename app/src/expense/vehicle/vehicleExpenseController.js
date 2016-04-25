app.controller('vehicleExpenseController',['$scope','$uibModal','expenseService','requestService','vehicleService',
                                           function($scope,$uibModal,expenseService,requestService,vehicleService){
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
		if(!expenseService.expense.vehicleExpense){
            expenseService.expense.vehicleExpense=res.data;
        }
        $scope.loading=false;
        pagination();
	};
    vehicleService.getVehicle('own').then(function(res){
        $scope.vehicleList=res.data[0].data;
        if(!vehicleService.vehicle.own){
            vehicleService.vehicle.own=res.data;
        }
    });    
    expenseService.getExpense('vehicleExpense').then(success);
    $scope.newExpense=function(){
        $uibModal.open({
          templateUrl: 'expense/vehicle/add-vehicle-expense.html',
          controller: 'addVehicleExpenseController',
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