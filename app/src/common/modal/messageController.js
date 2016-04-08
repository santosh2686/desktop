app.controller('messageController',['$scope','message','$uibModalInstance',function($scope,message,$uibModalInstance){
	$scope.msg = message;
	$scope.closeModal=function(){
		$uibModalInstance.close();
	}
}]);