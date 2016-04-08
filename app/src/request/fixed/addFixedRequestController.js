app.controller('addFixedRequestController',['$scope','$uibModalInstance','requestService','record',function($scope,$uibModalInstance,requestService,record){
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
		}
		
		$scope.openCalendar= function(type) {
			 $scope.calendar[type]= true;
		};
		
		$scope.submitRequest=function(){
			console.log($scope.requestData);		
		}
}]);
