app.controller('addRegularRequestController',
               ['$scope',
                '$q',
                '$uibModalInstance',
                'requestService',
                'vehicleService',
                'driverService',
                'partyService',
                'packageService',
                'record',
                function($scope,
                          $q,
                          $uibModalInstance,
                          requestService,
                          vehicleService,
                          driverService,
                          partyService,
                          packageService,
                          record){
		'use strict';		
		$scope.request=true;
		var currDate=new Date(),
		newObj={
			'requestType': 'local',
			'selectClient':'party',
			'vehicleSelect':'own',
			'startTrip':{
				'date':currDate
			},
			'endTrip':{
				'date': currDate
			},
			'openingKm':0,
			'closingKm':0,
			'totalKm':0,
			'totalHr':0,
			'totalDays':0,			
			'vehicle': {
				'AC': 'Yes'
			},
			'inDirect':{
				'AC':'Yes'
			},
			'operator':{
				'AC':'Yes'
			},
			'agency':{
				'AC': 'Yes'
			},
			'driverAllowance':0,
			'advanceAmt':0,
			'driverOverTime':0,
			'tollAmt':0,
			'parkingAmt':0,
			'totalAmt':0,
			'ownerTotal':0,
			'profit':0
		};
		
		$scope.requestData=(record.action==='new')?newObj:record.data[0];
        
        $q.all([vehicleService.getVehicle('own'),
                vehicleService.getVehicle('other'),
                driverService.getDriver(),
                partyService.getParty('client'),
                partyService.getParty('operator')]).then(function(res){
            
            /*Own Vehicle List*/
            $scope.vehicleList=res[0].data[0].data;
            if(!vehicleService.vehicle.own){
                vehicleService.vehicle.own=res[0].data;
            }
            
            /*Other Vehicle List*/
            $scope.oVehicleList=res[1].data[0].data;
            if(!vehicleService.vehicle.other){
                vehicleService.vehicle.other=res[1].data;
            }            
            
            /*Driver List*/
            $scope.driverList=res[2].data;
            if(!driverService.driver){
                driverService.driver=res[2].data;
            }
            
            /*Client List*/
            $scope.partyList=res[3].data[0].data;
            if(!partyService.party.client){
                partyService.party.client=res[3].data;
            }
            
            /*Operator List*/
            $scope.operatorList=res[4].data[0].data;
            if(!partyService.party.operator){
                partyService.party.operator=res[4].data;
            }
        });        
        
        $scope.$watch('requestData.requestType', function(newVal, oldVal){
		    packageService.getPackage(newVal).then(function(res){
                $scope.packageList=res.data[0].data;
                $scope.requestData.vehicle.partyPackage="";
                if(!packageService.package[newVal]){
                    packageService.package[newVal]=res.data;
                }
            });
	   });	
                    
		if(record.action=='edit'){
			$scope.requestData.startTrip.date=new Date($scope.requestData.startTrip.date);
			$scope.requestData.endTrip.date=new Date($scope.requestData.endTrip.date);
		}
		$scope.hideView=(record.action==='view');
		
		$scope.switchView=function(){
			$scope.request=!$scope.request;	
		};
		$scope.closeModal=function(){
			$uibModalInstance.close();
		};
	
		$scope.calendar={
			start:false,
			end:false
		};
        
		$scope.openCalendar= function(type) {
			 $scope.calendar[type]= true;
		};
		
		$scope.submitRequest=function(){
			console.log($scope.requestData);		
		}
}]);
