app.controller('operatorPaymentController',
               ['$scope','$q','$filter','config','partyService','requestService','pdfService',
               function($scope,$q,$filter,config,partyService,requestService,pdfService){
    $scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=true;
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.yearList=config.years();
    $scope.filter={};
    $scope.filter.year=new Date().getFullYear().toString();
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
    var opearatorRegData=null,
        opearatorFixData=null,
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
			var req=$filter('filter')(opearatorRegData,{"selectClient":"operator","operatorName":item.name});
       item.totalInReq = req.length;
			for(var i=0;i<req.length;i++){
				paymentIn=paymentIn+((req[i].totalAmt+req[i].tollAmt+req[i].parkingAmt+req[i].driverOverTime)-(req[i].advanceAmt?req[i].advanceAmt:0));
			}
			return paymentIn;
    },
    getPaymentOut=function(item){        
            var paymentOut=0;
			var req=$filter('filter')(opearatorRegData,{"vehicleSelect":"operator","operator":{"operatorName":item.name}});
			var fixReq=$filter('filter')(opearatorFixData,{"vehicleSelect":"operator","operator":{"operatorName":item.name}});
			item.totalOutReq = req.length+fixReq.length;
			for(var i=0;i<req.length;i++){
				paymentOut=paymentOut+(req[i].ownerTotal+req[i].tollAmt+req[i].parkingAmt+req[i].driverOverTime);
			}			
			for(var i=0;i<fixReq.length;i++){
				paymentOut=paymentOut+fixReq[i].totalAmt+fixReq[i].tollAmt+fixReq[i].parkingAmt+fixReq[i].driverOverTime;
			}
			return paymentOut;
    },
    processForpdf=function(data){
        var rowData=[];
        for(var i=0;i<data.length;i++){
            var rowItem=[i+1,data[i].name,data[i].totalInReq,data[i].totalOutReq,$filter('number')(data[i].paymentIn,'2')+'/-',$filter('number')(data[i].paymentOut,'2')+'/-', $filter('number')(data[i].diff,'2')+'/-'];
            rowData.push(rowItem);
        }
        return rowData;
    };
    
    $scope.calculatePayment=function(){
         $scope.data=[];
         $scope.loading=true;
        $q.all([getRegularData(),getFixedData()]).then(function(data){            
                opearatorRegData=data[0];
                opearatorFixData=data[1];
                angular.forEach($scope.operatorList,function(item){
					item.paymentIn=getPaymentIn(item);
					item.paymentOut=getPaymentOut(item);
					item.diff=item.paymentIn-item.paymentOut;
				});  
                $scope.data=$scope.operatorList;
                $scope.loading=false;
        });
    };
    $scope.getOperatorDetail=function(id,name){
        console.log(id);
        console.log(name);
    };
                   
    $scope.exportData=function(){
        var columns=['Sr.No','Operator Name','Out Bound Requests','In Bound Requests','Payment In','Payment Out','Difference'];
        pdfService.buildPDF(columns,processForpdf($scope.data),'Operator Payment - '+$scope.filter.month+' '+$scope.filter.year,'Operator_Payment_'+$scope.filter.month+'_'+$scope.filter.year,0);
    };
                   
    partyService.getParty('operator').then(function(res){
        $scope.operatorList = res.data[0].data;        
        $scope.calculatePayment();
    });
    
}]);
