app.controller('operatorController',['$scope','partyService','gridMap',function($scope,partyService,gridMap){
    $scope.data=[];
    $scope.gridConfig=gridMap.PARTY.OPERATOR;
	$scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!partyService.party.operator){
            partyService.party.operator=res.data;
        }
        $scope.loading=false;
	};
    partyService.getParty('operator').then(success);
    
    $scope.view=function(){
        console.log('VIEW');
    }
    $scope.edit=function(){
        console.log('EDIT');
    }
    $scope.delete=function(){
        console.log('DELETE');
    }
}]);