app.factory('partyService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		party:{
            'client':null,
            'operator':null
        },
        filterRecord:function(type,id){		
			return $filter('filter')(this.party[type][0].data,{'_id':config.local?id:{'$oid':id}});
		},
        getParty:function(type){
            return (this.party[type])?$q.resolve({data:this.party[type]}):config.getData(config.party,'q={"name":"'+type+'"}');
        },
        addParty:function(filter,item){
			item._id = config.local?config.guid():{'$oid':config.guid()};
			return config.updateData(config.party,filter,{$push:{data:item}});
        },
        updateParty:function(filter,item){
            return config.updateData(config.party,filter,{$set:{"data.$":item}});
        },
        deleteParty:function(filter,id){
			var item = {'_id':config.local?id:{'$oid':id}};
             return config.updateData(config.party,filter,{$pull:{data:item}});
        }
	}
}]);