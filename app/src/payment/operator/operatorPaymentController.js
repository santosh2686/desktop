app.controller('operatorPaymentController',
               ['$scope','$q','$filter','config','partyService',
               function($scope,$q,$filter,config,partyService){
    $scope.data=[];
    $scope.localEnv=config.local;
    $scope.loading=false;
    $scope.currMonth=new Date().getMonth();
    $scope.monthList=config.months;
    $scope.yearList=config.years();
    $scope.filter={};
    $scope.filter.year=new Date().getFullYear().toString();
    $scope.filter.month=$scope.monthList[$scope.currMonth];
    
    var getRegularData=function(){
    
    },
    getFixedData=function(){
        
    }
    
    $scope.calculatePayment=function(){
        $q.all([getRegularData(),getFixedData()]).then(function(res){
            console.log(res);
        });
    };
                   
    partyService.getParty('operator').then(function(res){
        $scope.operatorList = res.data[0].data;
        $scope.calculatePayment();
    });
    
    
}]);
