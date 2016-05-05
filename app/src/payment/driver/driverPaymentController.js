app.controller('driverPaymentController',
               ['$scope','$q','$filter','config','driverService','requestService','expenseService',
                function($scope,$q,$filter,config,driverService,requestService,expenseService){
    $scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=true;
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.yearList=config.years();
    $scope.filter={};
    $scope.filter.year=new Date().getFullYear().toString();
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
    var getLocalRequestCount=function(driver){
		   return $filter('filter')($scope.regularData,{'vehicle':{'driver':driver}, 'requestType':'local'}).length+$filter('filter')($scope.fixedData,{'driver':driver,'requestType':'local'}).length;
    },
    getOutRequestCount=function(driver){
        return $filter('filter')($scope.regularData,{'vehicle':{'driver':driver},'requestType':'out'}).length+$filter('filter')($scope.fixedData,{'driver':driver,'requestType':'out'}).length;
    },
    getAllowance=function(driver){
            var allowanceList = $filter('filter')($scope.regularData,{'vehicle':{'driver':driver}});
			var allowanceTotal=0;		
			for(var i=0;i<allowanceList.length;i++){
				allowanceTotal=allowanceTotal+allowanceList[i].driverAllowance+allowanceList[i].driverOverTime;
			}
			return allowanceTotal;
    },
    getFixReqAmt=function(driver){
            var fixedDataList=$filter('filter')($scope.fixedData,{'driver':driver});
			var fixedTotal=0;
			for(var i=0;i<fixedDataList.length;i++){
fixedTotal=fixedTotal+fixedDataList[i].diverAllowanceAmt+fixedDataList[i].driverOverTime+fixedDataList[i].nightHaltAmt;
			}		
			return fixedTotal;
    },
    getAdvanceAmt=function(driver){
			var advancedList = $filter('filter')($scope.expenseData,{'driver':driver});
			var advancedTotal=0;
			for(var i=0;i<advancedList.length;i++){
				advancedTotal=advancedTotal+advancedList[i].expenseAmt;
			}			
			return advancedTotal;
    },
    getTotalSalary=function(driverDataItem){
        return (driverDataItem.salary+driverDataItem.allowance+driverDataItem.fixrequestAmt)-driverDataItem.advanceAmt;
    }, 
    getRegularData=function(){
        var def=$q.defer();
        if(requestService.request.regular){
            var regData=$filter('filter')(requestService.request.regular,{'vehicleSelect':'own',"month":$scope.filter.month,"year":$scope.filter.year}); 
            def.resolve(regData)
        }else{
            requestService.getRequest("regular",'q={"vehicleSelect":"own","month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
            def.resolve(res.data);
        });
        }
        return def.promise;
    },
    getFixedData=function(){
        var def=$q.defer();
        if(requestService.request.fixed){
            var fixData = requestService.request.fixed.filter(function(item){
                return ((item.regularVehicle=="own" && item.vehicleSelect=="daily") || (item.regularVehicle=="own" && item.vehicleSelect=="own") || (item.regularVehicle=="indirect" && item.vehicleSelect=="own")) && item.month==$scope.filter.month && item.year==$scope.filter.year;
            });
            def.resolve(fixData)
        }else{            
            requestService.getRequest("fixed",'q={"$or":[{"regularVehicle":"own","vehicleSelect":"daily"},{"regularVehicle":"own","vehicleSelect":"own"},{"regularVehicle":"indirect","vehicleSelect":"own"}],"month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
                def.resolve(res.data);
		  });
        }
        return def.promise;
    },
    getExpenseData=function(){
        var def=$q.defer();
        if(expenseService.expense.driverExpense){
            var expData = $filter('filter')(expenseService.expense.driverExpense,{"month":$scope.filter.month,"year":$scope.filter.year});
            def.resolve(expData);
        }else{
            expenseService.getExpense('driverExpense','q={"month":"'+$scope.filter.month+'","year":"'+$scope.filter.year+'"}').then(function(res){
                def.resolve(res.data);
            });
        }
        return def.promise;
    };
    $scope.calculatePayment=function(){
        $q.all([getRegularData(),getFixedData(),getExpenseData()]).then(function(data){
            $scope.regularData=data[0];
            $scope.fixedData=data[1];
            $scope.expenseData=data[2];
            for(var i=0;i<$scope.driverList.length;i++){
                $scope.driverList[i].localRequest=getLocalRequestCount($scope.driverList[i].name);
                $scope.driverList[i].outRequest=getOutRequestCount($scope.driverList[i].name);
                $scope.driverList[i].allowance=getAllowance($scope.driverList[i].name);
                $scope.driverList[i].fixrequestAmt=getFixReqAmt($scope.driverList[i].name);
                $scope.driverList[i].advanceAmt=getAdvanceAmt($scope.driverList[i].name);            
                $scope.driverList[i].totalSalary=getTotalSalary($scope.driverList[i]);
            }
            $scope.data=$scope.driverList;
            $scope.loading=false;
        });
    };
      
    driverService.getDriver().then(function(res){
        $scope.driverList = res.data;
        $scope.calculatePayment();
    });

}]);
