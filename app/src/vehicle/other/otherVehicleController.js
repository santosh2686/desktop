app.controller('otherVehicleController',['$scope','vehicleService','gridMap',function($scope,vehicleService,gridMap){
    $scope.data=[];
    $scope.gridConfig=gridMap.VEHICLE.OTHER;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!vehicleService.vehicle.other){
            vehicleService.vehicle.other=res.data;
        }
	    $scope.loading=false;
	};
    vehicleService.getVehicle('other').then(success);
    
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
