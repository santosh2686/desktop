app.factory('driverService',['$filter','$q','config',function($filter,$q,config){
	return{
		driver:null,
        filterRecord:function(id){
			return $filter('filter')(this.driver,{'_id':config.local?id:{'$oid':id}});
		},
        getDriver:function(){
            if(this.driver){
                return $q.resolve({data:this.driver});
            }else{
                return config.getData(config.driver,'q={}');	
            }
        },
        addDriver:function(driver){
            return config.postData(config.driver,driver);
        },
        updateDriver:function(id,data){
            var filter=config.local?'{"_id":"'+id+'"}':'{"_id":{"$oid":"'+id.$oid+'"}}';
            return config.updateData(config.driver,filter,{$set:data});
        },
        deleteDriver:function(id){
            return config.deleteData(config.driver,id);
        }
	}
}]);