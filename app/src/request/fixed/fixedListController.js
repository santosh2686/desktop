app.controller('fixedListController',['$scope','$rootScope','$filter','requestService','config','partyService','messageService',function($scope,$rootScope,$filter,requestService,config,partyService,messageService){
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
	var pagination=function(){
		$scope.loading=false;
		$scope.totalItems=$scope.data.length;
		$scope.currentPage=requestService.request.pager.currentPage;
		$scope.itemsPerPage=requestService.request.pager.itemsPerPage;
		$scope.maxSize=requestService.request.pager.maxSize;
	},
	success=function(res){
		$scope.data=res.data;
        initialData=angular.copy($scope.data);
		if(!requestService.request.fixed){
            requestService.request.fixed=res.data;
        }
		pagination();
	},
    init=function(){
        requestService.getRequest('fixed','s={"date":-1}').then(success);
    };	
    
    partyService.getParty('client').then(function(res){
        $scope.partyList=res.data[0].data;
		if(!partyService.party.client){
            partyService.party.client=res.data;
        }
        init();
    });
    
        $rootScope.$on('fixedRequest',function(){
            init();
        });
    
        $scope.applyFilter=function(){
            $scope.data=$filter('filter')(initialData,{"partyName":$scope.filter.party,"month":$scope.filter.month});
        };
        $scope.clearFilter=function(){
            $scope.data=initialData;
            $scope.filter.party="";
            $scope.filter.month=$scope.monthList[$scope.currMonth];
        }
    
    
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
		requestService.deleteRequest('fixed',id).then(function(res){
            requestService.request.fixed=null;
            init();
            messageService.showMessage({
                'type':'success',
                'title':'Fixed Request',
                'text':'Fixed Request Deleted successfully.'
            });
        },function(){
			 messageService.showMessage({
                'type':'error',
                'title':'Fixed Request',
                'text':'Fixed Request can not be deleted at this time. Please try again.'
            });
		});
	};

}]);
