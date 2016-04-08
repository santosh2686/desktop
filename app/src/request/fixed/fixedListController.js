app.controller('fixedListController',['$scope','requestService','partyService',function($scope,requestService,partyService){
    $scope.data=[];
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
		if(!requestService.request.fixed){
            requestService.request.fixed=res.data;
        }
		pagination();
	};	
    requestService.getRequest('fixed','s={"date":-1}').then(success);
    partyService.getParty('client').then(function(res){
        $scope.partyList=res.data[0].data;
		if(!partyService.party.client){
            partyService.party.client=res.data;
        }
    });
    $scope.newRequest=function(template,controller){
		requestService.newRequest('fixed',template,controller);
	};
	
	$scope.viewRequest=function(template,controller,id){
		requestService.viewRequest('fixed',template,controller,id);	
	};
	
	$scope.editRequest=function(template,controller,id){
		requestService.editRequest('fixed',template,controller,id);
	};
	
	$scope.deleteRequest=function(id){
		console.log(id);
	};

}]);
