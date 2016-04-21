app.controller('addFixedRequestController',['$scope','$uibModalInstance','requestService','record',function($scope,$uibModalInstance,requestService,record){
		'use strict';		
		$scope.request=true;
		var currDate=new Date(),
		newObj={
			'vehicleSelect':'daily',
			'requestType':'local',
			'regularVehicle':'own',
			'nightHaltAmt':0,
            'date':currDate,
			'diverAllowanceAmt':0,
			'openingKm':0,
			'closingKm':0,
			'totalKm':0,
			'startTime':'',
			'totalHr':0,
			'extraHr':0,
			'tollAmt':0,
			'parkingAmt':0,
			'totalAmt':0,
			'driverOverTime':0
		};
		
		$scope.requestData=(record.action==='new')?newObj:record.data[0];
		if(record.action=='edit'){
			$scope.requestData.date=new Date($scope.requestData.date);
		}
		$scope.hideView=(record.action==='view');
		
		$scope.switchView=function(){
			$scope.request=!$scope.request;	
		};
		$scope.closeModal=function(){
			$uibModalInstance.close();
		};
	
		$scope.calendar={}
		
		$scope.openCalendar= function(type) {
			 $scope.calendar[type]= true;
		};
		
		$scope.submitRequest=function(){
			console.log($scope.requestData);		
		}
}]);
