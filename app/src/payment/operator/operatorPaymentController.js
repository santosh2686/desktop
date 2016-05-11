app.controller('operatorPaymentController',
               ['$scope','$q','$filter','config','partyService','requestService',
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
    
    var opearatorRegData=[],
        opearatorFixData=[], 
        getRegularData=function(){
            var def=$q.defer();
            if(requestService.request.regular){
                var regData=requestService.request.regular.filter(function(item){
                    return (item.selectClient=="operator" || item.vehicleSelect=="operator") && item.month==$scope.filter.month && item.year==$scope.filter.year;
                });
                def.resolve(regData);
            }else{
                requestService.getRequest("regular",'q={"$or":[{"selectClient":"operator"},{"vehicleSelect":"operator"}],"month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
                def.resolve(res.data);
            });
            }
            return def.promise;
    },
    getFixedData=function(){
        var def=$q.defer();
        if(requestService.request.fixed){
            var fixData = requestService.request.fixed.filter(function(item){
                return item.vehicleSelect=="operator" && item.month==$scope.filter.month && item.year==$scope.filter.year;
            });
            def.resolve(fixData)
        }else{            
            requestService.getRequest("fixed",'q={"vehicleSelect":"operator","month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
                def.resolve(res.data);
		  });
        }
        return def.promise;
    },   
   getPaymentIn=function(item){
        var paymentIn=0;
			var req=$filter('filter')(opearatorRegData,{'operatorName':item.name});
			item.totalInReq = req.length;
			for(var i=0;i<req.length;i++){
				paymentIn=paymentIn+((req[i].totalAmt+req[i].tollAmt+req[i].parkingAmt+req[i].driverOverTime)-(req[i].advanceAmt?req[i].advanceAmt:0));
			}
			return paymentIn;
    },
    getPaymentOut=function(item){
        var paymentOut=0;
			var req=$filter('filter')(opearatorRegData,{'operator':{'operatorName':item.name}});
			var fixReq=$filter('filter')(opearatorFixData,{'operator':{'operatorName':item.name}});
			opr.totalOutReq = req.length+fixReq.length;
			for(var i=0;i<req.length;i++){
				paymentOut=paymentOut+(req[i].ownerTotal+req[i].tollAmt+req[i].parkingAmt+req[i].driverOverTime);
			}			
			for(var i=0;i<fixReq.length;i++){
				paymentOut=paymentOut+fixReq[i].totalAmt+fixReq[i].tollAmt+fixReq[i].parkingAmt+fixReq[i].driverOverTime;
			}
			return paymentOut;
    };
    
    $scope.calculatePayment=function(){
         $scope.data=null;
         $scope.loading=true;
        $q.all([getRegularData(),getFixedData()]).then(function(res){
                opearatorRegData=res[0].data;
                opearatorFixData=res[1].data;
             console.log(opearatorRegData);
            console.log(opearatorFixData);
                angular.forEach($scope.operatorList,function(item){
					item.paymentIn=getPaymentIn(item);
					item.paymentOut=getPaymentOut(item);
					item.diff=item.paymentIn-item.paymentOut;
				});
            
              $scope.data=$scope.operatorList;
              $scope.loading=false;
        });
    };
                   
    partyService.getParty('operator').then(function(res){
        $scope.operatorList = res.data[0].data;
        
        $scope.calculatePayment();
    });
    
    
}]);
