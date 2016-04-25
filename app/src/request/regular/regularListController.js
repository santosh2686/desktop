app.controller('regularListController',['$scope','$rootScope','$q','$filter','requestService','config','messageService','vehicleService','driverService',
                                        function($scope,$rootScope,$q,$filter,requestService,config,messageService,vehicleService,driverService){
	$scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=true;      
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    var initialData;
	$scope.filter={
		'type':'vehicle'
	}
    $scope.filter.month=$scope.monthList[$scope.currMonth];
	var pagination=function(){
		$scope.loading=false;		$scope.totalItems=$scope.data.length;
		$scope.currentPage=requestService.request.pager.currentPage;
		$scope.itemsPerPage=requestService.request.pager.itemsPerPage;
		$scope.maxSize=requestService.request.pager.maxSize;
	},
	success=function(res){
		$scope.data=res.data;
		initialData = angular.copy($scope.data);
        if(!requestService.request.regular){
            requestService.request.regular=res.data;
        }
		pagination();
	},
    init=function(){
        requestService.getRequest('regular','s={"startTrip.date":-1}').then(success);
    };    
    $q.all([vehicleService.getVehicle('own'),driverService.getDriver()]).then(function(res){
        $scope.vehicleList=res[0].data[0].data;
        if(!vehicleService.vehicle.own){
            vehicleService.vehicle.own=res[0].data;
        }
        $scope.driverList=res[1].data;
        if(!driverService.driver){
            driverService.driver=res[1].data;
        }
        init();
    }); 
    $rootScope.$on('regularRequest',function(){
        init();
    });	
                                            
    $scope.applyFilter=function(){
        if($scope.filter.type==='vehicle'){
				$scope.data=$filter('filter')(initialData,{"vehicleSelect":"own","vehicle":{"vehicle":$scope.filter.vehicle},"month":$scope.filter.month});
			}else if($scope.filter.type==='driver'){
				$scope.data=$filter('filter')(initialData,{"vehicleSelect":"own","vehicle":{"driver":$scope.filter.driver},"month":$scope.filter.month});				
			}
    };
    $scope.clearFilter=function(){
        $scope.data=initialData;
        $scope.filter.type='vehicle';
        $scope.filter.vehicle="";
        $scope.filter.driver="";
        $scope.filter.month=$scope.monthList[$scope.currMonth];
    }
    
	$scope.newRequest=function(template,controller){
		requestService.newRequest('regular',template,controller);
	};
	
	$scope.viewRequest=function(template,controller,id){
        requestService.viewRequest('regular',template,controller,id);	
	};
	
	$scope.editRequest=function(template,controller,id){
		requestService.editRequest('regular',template,controller,id);
	};
	
	$scope.deleteRequest=function(id){
        requestService.deleteRequest('regular',id).then(function(res){
            requestService.request.regular=null;
            init();
            messageService.showMessage({
                'type':'success',
                'title':'Regular Request',
                'text':'Regular Request Deleted successfully.'
            });
        },function(){
			 messageService.showMessage({
                'type':'error',
                'title':'Regular Request',
                'text':'Regular Request can not be deleted at this time. Please try again.'
            });
		});
	};
	
	$scope.exportData=function(){
		messageService.showMessage({
			title:'Regular Request',
			text:'Your loan has been approved and will let you know in couple of days...',
			type:'success'
		});
	}
		
}]);