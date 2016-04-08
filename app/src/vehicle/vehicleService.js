app.factory('vehicleService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		vehicle:{
            'own':null,
            'other':null
        },
        getVehicle:function(type){
             return (this.vehicle[type])?$q.resolve({data:this.vehicle[type]}):config.getData(config.vehicle,'q={"name":"'+type+'"}');
        },
        addVehicle:function(){
            
        },
        editVehicle:function(){
            
        },
        viewVehicle:function(){
            
        },
        deleteVehicle:function(){
            
        }
	}
}]);