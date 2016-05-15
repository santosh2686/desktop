app.controller('indirectPaymentController',
            ['$scope','$q','$filter','config','vehicleService','requestService','pdfService',
            function($scope,$q,$filter,config,vehicleService,requestService,pdfService){
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
    },
    processForpdf=function(data){
        var rowData=[];
        for(var i=0;i<data.length;i++){
            var rowItem=[i+1,$filter('date')(data[i].date?data[i].date:data[i].startTrip.date,'dd-MMM-yyyy'),data[i].requestType==='local'?'Local':'Out Station',$filter('number')(data[i].totalAmt,'2')+'/-',$filter('number')(data[i].tollAmt,'2')+'/-',$filter('number')(data[i].parkingAmt,'2')+'/-', $filter('number')((data[i].totalAmt+data[i].tollAmt+data[i].parkingAmt),'2')+'/-'];
            rowData.push(rowItem); 
        }
        return rowData;
    };
     $scope.exportData=function(){
      var columns=['Sr. No','Date','Request Type','Trip Amount','Toll Amount','Parking Amount','Total Amount'];
       pdfService.buildPDF(columns,processForpdf($scope.data),'Indirect Payment - '+$scope.filter.month+' '+$scope.filter.year,'Indirect_Payment_'+$scope.filter.month+'_'+$scope.filter.year,0,'Party Name : '+$scope.filter.vehicle+', Month : '+$scope.filter.month+',  Year : '+$scope.filter.year+'  ::  Total Amount : '+$filter('number')($scope.indirectTotal,'2')+'/-');
    };
                
    $scope.calculatePayment=function(){
        $scope.data=[];
        $scope.loading=true;
        fetchRegularData();
    };

}]);
