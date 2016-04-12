app.factory('packageService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		package:{
            'local':null,
            'out':null,
            'fix':null
        },
        filterRecord:function(type,id){		
			return $filter('filter')(this.package[type][0].data,{'_id':config.local?id:{'$oid':id}});
		},
        getPackage:function(type){
            return (this.package[type])?$q.resolve({data:this.package[type]}):config.getData(config.package,'q={"name":"'+type+'"}');
        },
        addPackage:function(filter,item){
			item._id = config.local?config.guid():{'$oid':config.guid()};
			return config.updateData(config.package,filter,{$push:{data:item}});
        },
        updatePackage:function(filter,item){
            return config.updateData(config.package,filter,{$set:{"data.$":item}});
        },
        deletePackage:function(filter,id){
			var item = {'_id':config.local?id:{'$oid':id}};
             return config.updateData(config.package,filter,{$pull:{data:item}});
        }
	}
}]);