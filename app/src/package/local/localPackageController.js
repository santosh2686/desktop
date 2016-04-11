app.controller('localPackageController',['$scope','$uibModal','packageService','gridMap',function($scope,$uibModal,packageService,gridMap){
    $scope.data=[];
    $scope.gridConfig=gridMap.PACKAGE;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!packageService.package.local){
            packageService.package.local=res.data;
        }
        $scope.loading=false;
	},
    init=function(){
        packageService.getPackage('local').then(success);
    },
    packageModal=function(action,data){
        $uibModal.open({
              templateUrl: 'package/package-modal.html',
              controller: 'packageModalController',
              size: 'lg',
              resolve:{
                record:function(){
                    return {
                        'action':action,
                        'type':'local',
                        'data':data
                    };
                }
              }
          });
    };    
    init();
    $scope.newPackage=function(){
        packageModal('new',{});
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