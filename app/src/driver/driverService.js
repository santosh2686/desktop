app.factory('driverService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		driver:null,
        getDriver:function(){
            if(this.driver){
                return $q.resolve({data:this.driver});
            }else{			
                return config.getData(config.driver);	
            }
        },
        addDriver:function(){
            
        },
        editDriver:function(){
            
        },
        viewDriver:function(){
            
        },
        deleteDriver:function(){
            
        }
	}
}]);