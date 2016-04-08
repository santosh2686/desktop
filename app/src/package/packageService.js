app.factory('packageService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		package:{
            'local':null,
            'out':null,
            'fix':null
        },
        getPackage:function(type){
            return (this.package[type])?$q.resolve({data:this.package[type]}):config.getData(config.package,'q={"name":"'+type+'"}');
        },
        addPackage:function(){
            
        },
        editPackage:function(){
            
        },
        viewPackage:function(){
            
        },
        deletePackage:function(){
            
        }
	}
}]);