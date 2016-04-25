app.controller('allListController',['$scope','$rootScope','$q','$filter','config','requestService','vehicleService','driverService','partyService','messageService',function($scope,$rootScope,$q,$filter,config,requestService,vehicleService,driverService,partyService,messageService){
    $scope.data=[];
    $scope.localEnv=config.local;
	$scope.loading=true;
    $scope.currMonth=new Date().getMonth();
     $scope.monthList=config.months;
    var initialData;
	$scope.filter={
		'type':'party'
	}
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
   
    var init=function(){
        $q.all([requestService.getRequest('regular','s={"startTrip.date":-1}'),requestService.getRequest('fixed','s={"date":-1}'),vehicleService.getVehicle('own'),driverService.getDriver(),partyService.getParty('client')]).then(function(data){
            $scope.loading=false;         
            getAllRequests(data[0].data,data[1].data)
            vehicleList(data[2].data);
            driverList(data[3].data);
            partyList(data[4].data);
        });
      
    },
    pagination=function(){
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
			angular.forEach(regData,function(item,key){				
                allData.push({'_id':$scope.localEnv?item._id:item._id.$oid, 'date':item.startTrip.date,'request':'regular','requestType':item.requestType==='local'?'Local':'Out Station','client':item.selectClient==='party'?item.partyName:item.selectClient==='operator'?item.operatorName:item.userName,'vehicle':item.vehicleSelect==='own'?item.vehicle.vehicle:item.vehicleSelect==='indirect'?item.inDirect.vehicle:item.vehicleSelect==='operator'?item.operator.vehicleName+','+item.operator.vehicleNo:item.agency.vehicleName+','+item.agency.vehicleNo,'driver':item.vehicleSelect==='own'?item.vehicle.driver:item.vehicleSelect==='indirect'?item.inDirect.driver:item.vehicleSelect==='operator'?item.operator.driver:item.agency.driver,'totalKm':item.totalKm,'month':item.month,'year':item.year});
			});

        angular.forEach(fixData,function(item,key){				
            allData.push({'_id':$scope.localEnv?item._id:item._id.$oid, 'date':item.date,'request':'fixed','requestType':item.requestType==='local'?'Local':'Out Station','client':item.partyName,'vehicle':item.vehicleSelect==="daily"?item.vehicle:item.vehicleSelect==="own"?item.own.vehicle:item.vehicleSelect==="indirect"?item.inDirect.vehicle:item.vehicleSelect==="operator"?item.operator.vehicleName+','+item.operator.vehicleNo:item.agency.vehicleName+','+item.agency.vehicleNo,'driver':(item.vehicleSelect==="daily" || item.vehicleSelect==="own")?item.driver:item.vehicleSelect==="indirect"?item.inDirect.driver:item.vehicleSelect==="operator"?item.operator.driver:item.agency.driver,'totalKm':item.totalKm,'month':item.month,'year':item.year});
			});
        
			$scope.data=$filter('orderBy')(allData,'-date');
            initialData = angular.copy($scope.data);
            pagination()
    };
    
    init();
    
    $rootScope.$on('fixedRequest',function(){
        init();
    });
    $rootScope.$on('regularRequest',function(){
        init();
    });
    
    
      $scope.applyFilter=function(){
          switch($scope.filter.type){
           case 'party':{
					$scope.data=$filter('filter')(initialData,{"client":$scope.filter.party,"month":$scope.filter.month});
					break;
				}
				case 'vehicle':{
					$scope.data=$filter('filter')(initialData,{"vehicle":$scope.filter.vehicle,"month":$scope.filter.month});					
					break;
				}
				case 'driver':{
					$scope.data=$filter('filter')(initialData,{"driver":$scope.filter.driver,"month":$scope.filter.month});
					break;
				}
          }
    };
    $scope.clearFilter=function(){
        $scope.data=initialData;
        $scope.filter.type='party';
        $scope.filter.party="";
        $scope.filter.vehicle="";
        $scope.filter.driver="";
        $scope.filter.month=$scope.monthList[$scope.currMonth];
    }
    
	
	$scope.viewRequest=function(type,id){
        var ctrl = (type=='regular')?'addRegularRequestController':'addFixedRequestController';
        requestService.viewRequest(type,'request/'+type+'/add-'+type+'-request.html',ctrl,id);
	};
	
	$scope.editRequest=function(type,id){
        var ctrl = (type=='regular')?'addRegularRequestController':'addFixedRequestController';
        requestService.editRequest(type,'request/'+type+'/add-'+type+'-request.html',ctrl,id);
	};
    $scope.deleteRequest=function(type,id){
		requestService.deleteRequest(type,id).then(function(res){
            requestService.request[type]=null;
            init();
            messageService.showMessage({
                'type':'success',
                'title':type+' Request',
                'text':type+' Request Deleted successfully.'
            });
        },function(){
			 messageService.showMessage({
                'type':'error',
                'title':type+' Request',
                'text':type+' Request can not be deleted at this time. Please try again.'
            });
		});
	};
    
}]);
