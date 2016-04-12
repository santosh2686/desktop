app.controller('fixPackageController',['$scope','$rootScope','$uibModal','packageService','messageService','gridMap',function($scope,$rootScope,$uibModal,packageService,messageService,gridMap){
    $scope.data=[];
	$scope.gridConfig=gridMap.PACKAGE;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!packageService.package.fix){
            packageService.package.fix=res.data;
        }
        $scope.loading=false;
	},
    init=function(){
        packageService.getPackage('fix').then(success);
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
                        'type':'fix',
                        'data':data
                    };
                }
              }
          });
    };
	$rootScope.$on('fixPackage',function(){
        init();
    });
    init();
    $scope.newPackage=function(){
        packageModal('new',{});    
    } 
	$scope.view=function(id){
		packageModal('view',packageService.filterRecord('fix',id)[0]);
    }
    $scope.edit=function(id){
       packageModal('edit',packageService.filterRecord('fix',id)[0]);
    }
    $scope.delete=function(id){
       var pkgName = packageService.filterRecord('fix',id)[0].packageCode;
		  packageService.deletePackage('{"name":"fix"}',id).then(function(){
				 messageService.showMessage({
					'type':'success',
					'title':'Package',
					'text':'Package '+pkgName+' Deleted successfully.'
				});
		  },function(){
				 messageService.showMessage({
					'type':'error',
					'title':'Package',
					'text':'Package '+pkgName+' can not be deleted at this time. Please try again.'
				});
		  });
    }
}]); 