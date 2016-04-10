app.controller('driverController',
               ['$scope','$rootScope','driverService','messageService','gridMap','$uibModal',
               function($scope,$rootScope,driverService,messageService,gridMap,$uibModal){
    $scope.data=[];
    $scope.gridConfig=gridMap.DRIVER;
	$scope.loading=true;    
    var init=function(){
        driverService.getDriver().then(success);
    },
    driverModal=function(type,data){
        $uibModal.open({
          templateUrl: 'driver/driver-modal.html',
          controller: 'driverModalController',
          size: 'lg',
          resolve:{
            record:function(){
                return {
                    'action':type,
                    'data':data
                };
            }
          }
      });
    },
    success=function(res){
		$scope.data=res.data;
        driverService.driver=res.data;
        $scope.loading=false;
	};    
    $rootScope.$on('driver',function(){
        init();
    });
    init();    
    $scope.addDriver=function(){
       driverModal('new',{});
    }
    $scope.view=function(id){
        driverModal('view',driverService.filterRecord(id)[0]);
    }
    $scope.edit=function(id){
      driverModal('edit',driverService.filterRecord(id)[0]);
    }
    $scope.delete=function(id){
        var driverName = driverService.filterRecord(id)[0].name;
       driverService.deleteDriver(id).then(function(res){
            driverService.driver=null;
            init();
            messageService.showMessage({
                'type':'success',
                'title':'Driver',
                'text':'Driver '+driverName+' Deleted successfully.'
            });
        });
    }
}]);