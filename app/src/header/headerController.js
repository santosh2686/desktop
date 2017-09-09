app.controller('headerController',['$scope','$state', '$http',function($scope, $state, $http){
	$scope.logOut=function(){
    $http.get('/logout').then(function (res) {
      $state.go('login');
    }, function () {
      console.log('ERROR');
    });
	}
}]);