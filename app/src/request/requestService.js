app.factory('requestService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		request:{
			'regular':null,
			'fixed':null,
			'pager':{
				'currentPage':1,
				'itemsPerPage':15,
				'maxSize':5
			}
		},
		filterRequest:function(type,id){
			return $filter('filter')(this.request[type],{'_id':config.local?id:{'$oid':id}});
		},
		getRequest:function(type,sort){            
            return (this.request[type])?$q.resolve({data:this.request[type]}):config.getData(config[type],sort);
		},
		newRequest:function(type,template,controller){
			var modalInstance = $uibModal.open({
			  templateUrl: template,
			  controller: controller,
			  size: 'lg',
			  resolve:{
			  	record:function(){
					return {
						'type':type,
						'action':'new'	
					};
				}
			  }
		  });
		},
		editRequest:function(type,template,controller,id){
			var self=this;
			var modalInstance = $uibModal.open({
			  templateUrl: template,
			  controller: controller,
			  size: 'lg',
			  resolve:{
				record:function(){
					return{
						'type':type,
						'action':'edit',
						'data':self.filterRequest(type,id)
					}
				} 
			  }
		  });
		},
		viewRequest:function(type,template,controller,id){
			var self=this;
			var modalInstance = $uibModal.open({
			  templateUrl: template,
			  controller: controller,
			  size: 'lg',
			  resolve:{
				record:function(){
					return{
						'type':type,
						'action':'view',
						'data':self.filterRequest(type,id)
					}
				} 
			  }
		  });
			
		}
	};	
}]);