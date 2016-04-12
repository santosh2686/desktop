app.factory('vehicleService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		vehicle:{
            'own':null,
            'other':null
        },
        filterRecord:function(type,id){		
			return $filter('filter')(this.vehicle[type][0].data,{'_id':config.local?id:{'$oid':id}});
		},
        getVehicle:function(type){
             return (this.vehicle[type])?$q.resolve({data:this.vehicle[type]}):config.getData(config.vehicle,'q={"name":"'+type+'"}');
        },
        addVehicle:function(filter,item){
			item._id = config.local?config.guid():{'$oid':config.guid()};
			return config.updateData(config.vehicle,filter,{$push:{data:item}});
        },
        updateVehicle:function(filter,item){
            return config.updateData(config.vehicle,filter,{$set:{"data.$":item}});
        },
        deleteVehicle:function(filter,id){
			var item = {'_id':config.local?id:{'$oid':id}};
            return config.updateData(config.vehicle,filter,{$pull:{data:item}});
        }
	}
}]);