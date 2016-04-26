app.controller('dashboardController',['$scope','$q','driverService','packageService','vehicleService','partyService',function($scope,$q,driverService,packageService,vehicleService,partyService){
	$scope.currDate = new Date();
}]);