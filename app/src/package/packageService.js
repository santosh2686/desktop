app.factory('packageService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		package:{
            'local':null,
            'out':null,
            'fix':null
        },
        filterRecord:function(type,id){
			return $filter('filter')(this.package[type],{'_id':config.local?id:{'$oid':id}});
		},
        getPackage:function(type){
            return (this.package[type])?$q.resolve({data:this.package[type]}):config.getData(config.package,'q={"name":"'+type+'"}');
        },
        addPackage:function(package){
            //return config.postData(config.package,package);
        },
        updatePackage:function(filter,item){
            //return config.updateData(config.package,package);
             //var filter=config.local?'{"_id":"'+id+'"}':'{"_id":{"$oid":"'+id.$oid+'"}}';
            return config.updateData(config.package,filter,{$push:{data:item}});
        },
        deletePackage:function(type,id){
            
        }
	}
}]);