app.controller('driverController',['$scope','driverService','gridMap',function($scope,driverService,gridMap){
    $scope.data=[];
    $scope.gridConfig=gridMap.DRIVER;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data;
		if(!driverService.driver){
            driverService.driver=res.data;
        }
        $scope.loading=false;
	};
    driverService.getDriver().then(success);
    
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