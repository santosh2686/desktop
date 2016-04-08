app.controller('headerController',['$scope','$state',function($scope,$state){
	$scope.logOut=function(){
		$state.go('login');
	}
}]);