app.controller('regularListController',['$scope','$rootScope','$q','$filter','requestService','config','messageService','vehicleService','driverService','pdfService',
                                        function($scope,$rootScope,$q,$filter,requestService,config,messageService,vehicleService,driverService,pdfService){
	$scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=true;      
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.filter={
		'type':'vehicle'
	}
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    var initialData,
        pagination=function(){
		$scope.loading=false;		
        $scope.totalItems=$scope.data.length;
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
                                            
        $scope.processForpdf=function(data){
			var rowData=[];
			for(var i=0;i<data.length;i++){
				var rowItem=[i+1,$filter('date')(data[i].startTrip.date,'dd-MMM-yyyy'),data[i].selectClient==='party'?data[i].partyName:data[i].selectClient==='operator'?data[i].operatorName:data[i].userName,data[i].requestType==='local'?'Local':'Out Station',$filter('date')(data[i].endTrip.date,'dd-MMM-yyyy'),data[i].vehicleSelect==='own'?data[i].vehicle.driver:data[i].vehicleSelect==='indirect'?data[i].inDirect.driver:data[i].vehicleSelect==='operator'?data[i].operator.driver:data[i].agency.driver,data[i].vehicleSelect==='own'?data[i].vehicle.vehicle:data[i].vehicleSelect==='indirect'?data[i].inDirect.vehicle:data[i].vehicleSelect==='operator'?data[i].operator.vehicleName:data[i].agency.vehicleName,data[i].totalKm+' KM',$filter('number')(data[i].totalAmt,'2')+'/-'];
				rowData.push(rowItem);
			}
			return rowData;
		};
	
	$scope.exportData=function(){
        var columns=['Sr. No','Start Date','Client Name','Request Type','End Date','Driver Name','Vehicle','Total KM','Total Amt'];
			pdfService.buildPDF(columns,$scope.processForpdf($scope.data),'Regular Requests','Regular_Requests',8);	
	};	
}]);