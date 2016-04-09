app.factory('driverService',['$filter','$q','config',function($filter,$q,config){
	return{
		driver:null,
        getDriver:function(){
            if(this.driver){
                return $q.resolve({data:this.driver});
            }else{			
                return config.getData(config.driver);	
            }
        },
        addDriver:function(driver){
            return config.postData(config.driver,driver);
        },
        updateDriver:function(){
            
        },
        deleteDriver:function(){
            
        }
	}
}]);