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
app.directive('grid',function(){
    return{
        restrict:'AE',
        templateUrl:'common/grid.html',
        replace:true,
        scope: {
              datasource: '=',
              gridconfig:'=',
              view: '&',
              edit: '&',
              delete: '&'
        },
        controller:['$scope',function($scope){
            $scope.gridData=$scope.gridconfig;
            $scope.data=$scope.datasource;
            $scope.viewData=$scope.view;
            $scope.editData=$scope.edit;
            $scope.deleteData=$scope.delete;
        }]
    }
});