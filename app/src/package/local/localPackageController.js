app.controller('localPackageController',['$scope','packageService','gridMap',function($scope,packageService,gridMap){
    $scope.data=[];
    $scope.gridConfig=gridMap.PACKAGE;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!packageService.package.local){
            packageService.package.local=res.data;
        }
        $scope.loading=false;
	};
    packageService.getPackage('local').then(success);
    
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