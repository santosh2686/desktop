app.controller('clientPaymentController',['$scope','$q','$filter','config','partyService','requestService',
            function($scope,$q,$filter,config,partyService,requestService){
    $scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=false;
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.yearList=config.years();
    $scope.filter={};
    $scope.filter.year=new Date().getFullYear().toString();
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
    partyService.getParty('client').then(function(res){
        $scope.partyList=res.data[0].data;
		if(!partyService.party.client){
            partyService.party.client=res.data;
        }
    });
    var partyTotal=function(data){
         $scope.partyTotal=0;
			for(var i=0; i<data.length; i++){				        
                $scope.partyTotal=$scope.partyTotal+data[i].totalAmt+data[i].tollAmt+data[i].parkingAmt;
			}
    }
    $scope.calculatePayment=function(){
        $scope.data=[];
        $scope.loading=true;
        if(requestService.request.regular){
            $scope.data=$filter('filter')(requestService.request.regular,{"selectClient":"party","partyName":$scope.filter.party,"month":$scope.filter.month,"year":$scope.filter.year}); 
            $scope.loading=false;
            partyTotal($scope.data);
        }else{
            requestService.getRequest("regular",'q={"selectClient":"party","partyName":"'+$scope.filter.party+'","month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}&s={"startTrip.date":-1}').then(function(res){
            $scope.loading=false;
            $scope.data = res.data;
            partyTotal($scope.data);
        });
        }
    }
    
}]);
