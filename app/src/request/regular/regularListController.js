app.controller('regularListController',['$scope','$q','requestService','config','messageService','vehicleService','driverService',
                                        function($scope,$q,requestService,config,messageService,vehicleService,driverService){
	$scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=true;
	$scope.filter={
		'type':'vehicle'
	}
	var pagination=function(){
		$scope.loading=false;
		$scope.totalItems=$scope.data.length;
		$scope.currentPage=requestService.request.pager.currentPage;
		$scope.itemsPerPage=requestService.request.pager.itemsPerPage;
		$scope.maxSize=requestService.request.pager.maxSize;
	},
	success=function(res){
		$scope.data=res.data;
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
		console.log(id);
	};
	
	$scope.exportData=function(){
		messageService.showMessage({
			title:'Regular Request',
			text:'Your loan has been approved and will let you know in couple of days...',
			type:'success'
		});
	}
		
}]);