app.controller('driverController',['$scope','driverService','gridMap','$uibModal',function($scope,driverService,gridMap,$uibModal){
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
    $scope.addDriver=function(){
        $uibModal.open({
			  templateUrl: 'driver/driver-modal.html',
			  controller: 'driverModalController',
			  size: 'lg',
			  resolve:{
			  	record:function(){
					return {
						'action':'new'
					};
				}
			  }
		  });
    }
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