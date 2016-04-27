app.controller('driverController',
               ['$scope','$rootScope','driverService','messageService','config','$uibModal',
               function($scope,$rootScope,driverService,messageService,config,$uibModal){
    $scope.data=[];
	$scope.loading=true;
    $scope.localEnv = config.local;
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
        if(!driverService.driver){
            driverService.driver=res.data;
        }
        $scope.loading=false;
	};    
    $rootScope.$on('driver',function(){
        init();
    });
    init();    
    $scope.addDriver=function(){
       driverModal('new',{});
    }
    $scope.viewRequest=function(id){
        driverModal('view',driverService.filterRecord(id)[0]);
    }
    $scope.editRequest=function(id){
      driverModal('edit',driverService.filterRecord(id)[0]);
    }
    $scope.deleteRequest=function(id){
        var driverName = driverService.filterRecord(id)[0].name;
       driverService.deleteDriver(id).then(function(res){
            driverService.driver=null;
            init();
            messageService.showMessage({
                'type':'success',
                'title':'Driver',
                'text':'Driver '+driverName+' Deleted successfully.'
            });
        },function(){
			 messageService.showMessage({
                'type':'error',
                'title':'Driver',
                'text':'Driver '+driverName+' can not be deleted at this time. Please try again.'
            });
		});
    }
}]);