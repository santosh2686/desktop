app.controller('driverPaymentController',
               ['$scope','$q','$filter','config','driverService',
                function($scope,$q,$filter,config,driverService){
    $scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=false;
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.yearList=config.years();
    $scope.filter={};
    $scope.filter.year=new Date().getFullYear().toString();
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
                  
    var getLocalRequestCount=function(driver){
    
    },
    getOutRequestCount=function(driver){
    
    },
    getAllowance=function(driver){
    
    },
    getFixReqAmt=function(driver){
    
    },
    getAdvanceAmt=function(driver){
    
    },
    getTotalSalary=function(driver){
    
    };
      
    driverService.getDriver().then(function(res){
        $scope.data=res.data;
        for(var i=0;i<$scope.driverList.length;i++){
			$scope.data[i].localRequest=getLocalRequestCount($scope.data[i].name);
			$scope.data[i].outRequest=getOutRequestCount($scope.data[i].name);
			$scope.data[i].allowance=getAllowance($scope.data[i].name);
			$scope.data[i].fixrequestAmt=getFixReqAmt($scope.data[i].name);
			$scope.data[i].advanceAmt=getAdvanceAmt($scope.data[i].name);
            
			$scope.data[i].totalSalary=getTotalSalary($scope.data[i]);
        }
    });
    
                    
}]);
