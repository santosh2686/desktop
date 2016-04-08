app.service('messageService',['$uibModal',function($uibModal){
	this.showMessage=function(context){
		$uibModal.open({
			 templateUrl: 'common/modal/message.html',
			 controller:'messageController',
			 size:'md',
			 resolve:{
			  	message:function(){
					return context
				}
			  }
		});
	}
}]);