app.controller('ownVehicleController',['$scope','vehicleService','gridMap',function($scope,vehicleService,gridMap){
    $scope.data=[];
    $scope.gridConfig=gridMap.VEHICLE.OWN;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!vehicleService.vehicle.own){
            vehicleService.vehicle.own=res.data;
        }
	   $scope.loading=false;
	};
    vehicleService.getVehicle('own').then(success);
    
    $scope.view=function(){
        console.log('VIEW');
    }
    $scope.edit=function(){
        console.log('EDIT');
    }
    $scope.delete=function(){
        console.log('DELETE');
    }
}]);