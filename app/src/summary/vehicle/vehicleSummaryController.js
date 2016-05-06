app.controller('vehicleSummaryController',
               ['$scope','$state','$filter','config','vehicleService','requestService','expenseService',
               function($scope,$state,$filter,config,vehicleService,requestService,expenseService){
                $scope.yearList = config.years();

                if(sessionStorage.getItem('year')){
                    $scope.year=sessionStorage.getItem('year');
                }else{
                    $scope.year=new Date().getFullYear().toString();
                };
                
                var monthSet=config.months,
                   chartData={local:[],out:[],income:[],expense:[]},incomeChart,expenseChart,localChart,outChart,
        init=function(){
            $scope.loading=true;
            vehicleService.getVehicle('own').then(function(res){
                $scope.vehicleList=res.data[0].data;
                if(sessionStorage.getItem('veh')){
                    $scope.vehicleSelect=sessionStorage.getItem('veh');
                    
                }else{
                    $scope.vehicleSelect=$scope.vehicleList[0].vehicleName+','+$scope.vehicleList[0].vehicleNo;
                }
                loadSummary()
                if(!vehicleService.vehicle.own){
                    vehicleService.vehicle.own=res.data;
                }
            });
        },
        loadSummary=function(){
            requestService.getRequest('regular','q={"year":"'+$scope.year+'", "vehicleSelect":"own","vehicle.vehicle":"'+$scope.vehicleSelect+'"}&f={"requestType":1,"profit":1,"month":1}').then(function(res){
               for(var i=0; i<monthSet.length;i++){
                    chartData.local.push($filter('filter')(res.data,{'month':monthSet[i],'requestType':'local'}).length);
                    chartData.out.push($filter('filter')(res.data,{'month':monthSet[i],'requestType':'out'}).length);
                    calculateIncome($filter('filter')(res.data,{'month':monthSet[i]}));				
                };
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
            expenseService.getExpense('vehicleExpense','q={"year":"'+$scope.year+'", "vehicle":"'+$scope.vehicleSelect+'"}&f={"expenseAmt":1,"month":1}').then(function(res){
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
            sessionStorage.removeItem('veh');
            sessionStorage.removeItem('year');
        };
        init();
        $scope.redrawGraph=function(){
            sessionStorage.setItem('veh',$scope.vehicleSelect);
            sessionStorage.setItem('year',$scope.year);
            $state.reload();
        }
}]);