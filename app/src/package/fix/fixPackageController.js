app.controller('fixPackageController',['$scope','packageService','gridMap',function($scope,packageService,gridMap){
    $scope.data=[];
	$scope.gridConfig=gridMap.PACKAGE;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!packageService.package.fix){
            packageService.package.fix=res.data;
        }
        $scope.loading=false;
	};
    packageService.getPackage('fix').then(success);
    
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