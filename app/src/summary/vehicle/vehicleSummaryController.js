app.controller('vehicleSummaryController',
               ['$scope','$state','$filter','config','vehicleService','requestService','expenseService',
               function($scope,$state,$filter,config,vehicleService,requestService,expenseService){
               var monthSet=config.months,
                   chartData={local:[],out:[],income:[],expense:[]},incomeChart,expenseChart,localChart,outChart;
        var init=function(){
            $scope.loading=true;
            vehicleService.getVehicle('own').then(function(res){
                $scope.vehicleList=res.data[0].data;
                if(sessionStorage.getItem('veh')){
                    $scope.vehicleSelect=sessionStorage.getItem('veh');
                    sessionStorage.removeItem('veh');
                }else{
                    $scope.vehicleSelect=$scope.vehicleList[0].vehicleName+' '+$scope.vehicleList[0].vehicleNo;
                }
                
                loadSummary()
                if(!vehicleService.vehicle.own){
                    vehicleService.vehicle.own=res.data;
                }
            });
        },
        loadSummary=function(){
            requestService.getRequest('regular','q={"vehicleSelect":"own","vehicle.vehicle":"'+$scope.vehicleSelect+'"}&f={"requestType":1,"profit":1,"month":1}').then(function(res){
               for(var i=0; i<monthSet.length;i++){
                    chartData.local.push($filter('filter')(res.data,{'month':monthSet[i],'requestType':'local'}).length);
                    chartData.out.push($filter('filter')(res.data,{'month':monthSet[i],'requestType':'out'}).length);
                    calculateIncome($filter('filter')(res.data,{'month':monthSet[i]}));				
                }
                getExpense();
            });
        },
        calculateIncome=function(m){
            var totalProfit=0;
			for(var k=0;k<m.length;k++){				
				totalProfit = totalProfit+m[k].profit;				
			}
			chartData.income.push(totalProfit);
        },
        getExpense=function(){            
            expenseService.getExpense('vehicleExpense','q={"vehicle":"'+$scope.vehicle+'"}&f={"expenseAmt":1,"month":1}').then(function(res){
                for(var i=0; i<monthSet.length;i++){
						calculateExpense($filter('filter')(res.data,{'month':monthSet[i]}));				
				}
				updateSummary();
            });
        },
        calculateExpense=function(e){
            var totalExpense=0;
			for(var k=0;k<e.length;k++){			
				totalExpense = totalExpense+e[k].expenseAmt;				
			}
			chartData.expense.push(totalExpense);
        },
        updateSummary=function(){
            angular.forEach(chartData,function(item,key){                
               new Chart(document.getElementById(key),{
                    type: 'bar',
                    data: {
                    labels:config.months,
                    datasets:[{
                            label: key.toUpperCase()+' ',
                            backgroundColor: "rgba(54,162,235,0.2)",
                            borderColor: "rgba(54,162,235,1)",
                            borderWidth: 0.5,
                            hoverBackgroundColor: "rgba(54,162,235,0.4)",
                            hoverBorderColor: "rgba(54,162,235,1)",
                            data:item
                        }]
                    }
                });
            });
        };
        init();
        $scope.redrawGraph=function(){
            sessionStorage.setItem('veh',$scope.vehicleSelect);
            $state.reload();
        }
}]);