app.controller('partyModalController',
               ['$scope','$rootScope','$uibModalInstance','partyService','messageService','record',
                function($scope,$rootScope,$uibModalInstance,partyService,messageService,record){
    'use strict';
    $scope.party=angular.copy(record.data);
    $scope.action=record.action;
    $scope.type=record.type;
    $scope.loading=false;
    $scope.hideView=($scope.action==='view');
    $scope.closeModal=function(){
        $uibModalInstance.close();
    };
	
	if($scope.type=='operator' && $scope.action==='new'){
		$scope.party.vehicle=[{
					'name':'',
					'number':''
					}];
	}
    $scope.addNewVehicle=function(){
        $scope.party.vehicle.push({'name':'','number':''});
    };		
    $scope.removeVehicle=function(index){
        $scope.party.vehicle.splice(index,1);
    };
	
    $scope.submitRequest=function(){
        $scope.loading=true;
        if($scope.action==='new'){
            partyService.addParty('{"name":"'+$scope.type+'"}',JSON.parse(angular.toJson($scope.party))).then(function(){
               $scope.closeModal();
               partyService.party[$scope.type]=null;
               $rootScope.$emit($scope.type+'Party');
               messageService.showMessage({
                    'type':'success',
                    'title':'Party',
                    'text':'New '+$scope.type+' party added successfully.'
               });
            },function(){
                $scope.closeModal();
                messageService.showMessage({
                    'type':'error',
                    'title':'Party',
                    'text':$scope.type+' party not added successfully. Please try again.'
                });
            });
        }else{
            partyService.updateParty('{"name":"'+$scope.type+'","data._id":"'+$scope.party._id+'"}',JSON.parse(angular.toJson($scope.party)))
            .then(function(){
                $scope.closeModal();
                partyService.party[$scope.type]=null;
                $rootScope.$emit($scope.type+'Party');
                messageService.showMessage({
                    'type':'success',
                    'title':'Party',
                    'text':'New '+$scope.type+' party updated successfully.'
                });
            },function(err){
                $scope.closeModal();
                messageService.showMessage({
                    'type':'error',
                    'title':'Party',
                    'text':$scope.type+' party not updated successfully. Please try again.'
                });
            });
        }        
    };
}]);