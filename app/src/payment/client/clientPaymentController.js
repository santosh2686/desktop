app.controller('clientPaymentController',['$scope','$q','$filter','config','partyService','requestService','pdfService',
            function($scope,$q,$filter,config,partyService,requestService,pdfService){
    $scope.data=null;
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
    },
    processForpdf=function(data){
			var rowData=[];
			for(var i=0;i<data.length;i++){
				var rowItem=[i+1,$filter('date')(data[i].startTrip.date,'dd-MMM-yyyy'),data[i].requestType==='local'?'Local':'Out Station',data[i].vehicleSelect==='own'?data[i].vehicle.vehicle:data[i].vehicleSelect==='indirect'?data[i].inDirect.vehicle:data[i].vehicleSelect==='operator'?data[i].operator.vehicleName:data[i].agency.vehicleName,$filter('number')(data[i].totalAmt,'2')+'/-',$filter('number')(data[i].tollAmt,'2')+'/-',$filter('number')(data[i].parkingAmt,'2')+'/-',$filter('number')((data[i].totalAmt+data[i].tollAmt+data[i].parkingAmt),'2')+'/-'];
				rowData.push(rowItem);
			}			
			return rowData;
   };
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
    };
    
    $scope.exportData=function(){
      var columns=['Sr. No','Date','Request Type','Vehicle','Trip Amount','Toll Amount','Parking Amount','Total Amount'];  
      pdfService.buildPDF(columns,processForpdf($scope.data),'Client Payments','Client_Payments',0,'Party Name : '+$scope.filter.party+', Month : '+$scope.filter.month+',  Year : '+$scope.filter.year+'  ::  Total Amount : '+$filter('number')($scope.partyTotal,'2')+'/-');
    };
}]);
