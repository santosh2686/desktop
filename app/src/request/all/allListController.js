app.controller('allListController',['$scope','requestService','vehicleService','driverService','partyService','$q','$filter',function($scope,requestService,vehicleService,driverService,partyService,$q,$filter){
    $scope.loading=true;
    $scope.data=[];
    $scope.filter={
        'type':'party'
    }
    $q.all([requestService.getRequest('regular','s={"startTrip.date":-1}'),requestService.getRequest('fixed','s={"date":-1}'),vehicleService.getVehicle('own'),driverService.getDriver(),partyService.getParty('client')]).then(function(data){
        $scope.loading=false;         
        getAllRequests(data[0].data,data[1].data)
        vehicleList(data[2].data);
        driverList(data[3].data);
        partyList(data[4].data);
    });
    
    
    var pagination=function(){
		$scope.loading=false;
		$scope.totalItems=$scope.data.length;
		$scope.currentPage=requestService.request.pager.currentPage;
		$scope.itemsPerPage=requestService.request.pager.itemsPerPage;
		$scope.maxSize=requestService.request.pager.maxSize;
	},
    partyList=function(data){
        $scope.partyList=data[0].data;
        if(!partyService.party.client){
            partyService.party.client=data;
        }
    },
    vehicleList=function(data){
        $scope.vehicleList=data[0].data;
         if(!vehicleService.vehicle.own){
            vehicleService.vehicle.own=data;
        }
    },
    driverList=function(data){
        $scope.driverList=data;
        if(!driverService.driver){
            driverService.driver=data;
        }        
    },
    getAllRequests=function(regData,fixData){
        if(!requestService.request.regular){
            requestService.request.regular=regData;
        };
        if(!requestService.request.fixed){
            requestService.request.fixed=fixData;
        };
        var allData=[];
			angular.forEach(regData,function(item,key){				allData.push({'_id':item._id.$oid,'date':item.startTrip.date,'request':'regular','requestType':item.requestType==='local'?'Local':'Out Station','client':item.selectClient==='party'?item.partyName:item.selectClient==='operator'?item.operatorName:item.userName,'vehicle':item.vehicleSelect==='own'?item.vehicle.vehicle:item.vehicleSelect==='indirect'?item.inDirect.vehicle:item.vehicleSelect==='operator'?item.operator.vehicleName+','+item.operator.vehicleNo:item.agency.vehicleName+','+item.agency.vehicleNo,'driver':item.vehicleSelect==='own'?item.vehicle.driver:item.vehicleSelect==='indirect'?item.inDirect.driver:item.vehicleSelect==='operator'?item.operator.driver:item.agency.driver,'totalKm':item.totalKm,'month':item.month,'year':item.year});
			});

        angular.forEach(fixData,function(item,key){				allData.push({'_id':item._id.$oid,'date':item.date,'request':'fixed','requestType':item.requestType==='local'?'Local':'Out Station','client':item.partyName,'vehicle':item.vehicleSelect==="daily"?item.vehicle:item.vehicleSelect==="own"?item.own.vehicle:item.vehicleSelect==="indirect"?item.inDirect.vehicle:item.vehicleSelect==="operator"?item.operator.vehicleName+','+item.operator.vehicleNo:item.agency.vehicleName+','+item.agency.vehicleNo,'driver':(item.vehicleSelect==="daily" || item.vehicleSelect==="own")?item.driver:item.vehicleSelect==="indirect"?item.inDirect.driver:item.vehicleSelect==="operator"?item.operator.driver:item.agency.driver,'totalKm':item.totalKm,'month':item.month,'year':item.year});
			});
        
			$scope.data=$filter('orderBy')(allData,'-date');
            pagination()
    }    
    
}]);
