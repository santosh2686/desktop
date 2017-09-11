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
	};
	this.deleteConfirm = function (context) {
    return $uibModal.open({
      templateUrl: 'common/modal/deleteConfirmation.html',
      controller:'deleteConfirmationController',
      size:'sm',
      resolve:{
        message: function(){
          return context
        }
      }
    });
  }
}]);