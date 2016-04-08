app.controller('clientController',['$scope','partyService','gridMap',function($scope,partyService,gridMap){
    $scope.data=[];
	$scope.gridConfig=gridMap.PARTY.CLIENT;
    $scope.loading=true;
    var success=function(res){
		$scope.data=res.data[0].data;
		if(!partyService.party.client){
            partyService.party.client=res.data;
        }
        $scope.loading=false;
	};
    partyService.getParty('client').then(success);
    
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
