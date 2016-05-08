app.controller('indirectPaymentController',['$scope','$q','$filter','config','vehicleService','requestService',
            function($scope,$q,$filter,config,vehicleService,requestService){
    $scope.data=null;
    $scope.localEnv=config.local;
    $scope.loading=false;
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.yearList=config.years();
    $scope.filter={};
    $scope.filter.year=new Date().getFullYear().toString();
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
    vehicleService.getVehicle('other').then(function(res){
        $scope.vehicleList = res.data[0].data;
        if(!vehicleService.vehicle.other){
            vehicleService.vehicle.other=res.data;
        }
    });
    var fetchRegularData=function(){
        var regularData;
        if(requestService.request.regular){
            regularData=$filter('filter')(requestService.request.regular,{'vehicleSelect':'indirect',"inDirect":{"vehicle":$scope.filter.vehicle},"month":$scope.filter.month,"year":$scope.filter.year});
            fetchFixedData(regularData);
        }else{
            requestService.getRequest("regular",'q={"vehicleSelect":"indirect","inDirect.vehicle":"'+$scope.filter.vehicle+'","month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
            regularData = res.data;
            fetchFixedData(regularData)    
        });
        }        
    },
    fetchFixedData=function(regData){
        var fixedData;
          if(requestService.request.fixed){
            fixedData=$filter('filter')(requestService.request.fixed,{'vehicleSelect':'indirect',"inDirect":{"vehicle":$scope.filter.vehicle},"month":$scope.filter.month,"year":$scope.filter.year}); 
        calculateTotal(regData,fixedData);
          }else{
            requestService.getRequest("fixed",'q={"vehicleSelect":"indirect","inDirect.vehicle":"'+$scope.filter.vehicle+'","month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
            fixedData = res.data;
            calculateTotal(regData,fixedData);
        });
        }
    },
    calculateTotal=function(regData,fixData){
        $scope.data = regData.concat(fixData);
        $scope.loading=false;
        $scope.indirectTotal=0;
			for(var i=0; i<$scope.data.length; i++){
				$scope.indirectTotal=$scope.indirectTotal+$scope.data[i].totalAmt+$scope.data[i].tollAmt+$scope.data[i].parkingAmt;
			}
    };
    $scope.calculatePayment=function(){
        $scope.data=[];
        $scope.loading=true;
        fetchRegularData();
    };

}]);
