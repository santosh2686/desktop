app.directive('responsiveGrid',['$timeout',function($timeout){
		return function($sc,$el,$attr){
			var table = $($el).parent().parent(); 			
			if($sc.$last && !table.hasClass('footable-loaded')){
                $timeout(function(){                    
				    table.footable();
                }, 10);
			};
			if($sc.$last && table.hasClass('footable-loaded')){				
                $timeout(function(){                    
				    table.trigger('footable_redraw');
                }, 10);
			}
		}
}]);

/*Grid Directive*/
app.directive('grid',['config',function(config){
    return{
        restrict:'AE',
        templateUrl:'common/grid.html',
        replace:true,
        scope: {
              datasource: '=',
              gridconfig: '=',
              viewData: '&view',
              editData: '&edit',
              deleteData: '&delete'
        },
        controller:['$scope',function($scope){
            $scope.localEnv=config.local;
            $scope.gridData=$scope.gridconfig;            
            $scope.$watch('datasource',function(){
                $scope.data=$scope.datasource;
            });
        }]
    }
}]);

/*Input Validators*/
app.directive('number',function(){
    var REGEX = /^\-?\d+$/;
    return{
        restrict:'A',
        require:'ngModel',
        link:function($sc,$el,$attr,$ctrl){
            $ctrl.$validators.number=function(modelValue, viewValue){
                return REGEX.test(viewValue);
            }
        }
    }
});