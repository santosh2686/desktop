app.factory('partyService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
		party:{
            'client':null,
            'operator':null
        },
        getParty:function(type){
            return this.party[type]?$q.resolve({data:this.party[type]}):config.getData(config.party,'q={"name":"'+type+'"}');
        },
        addParty:function(){
            
        },
        editParty:function(){
            
        },
        viewParty:function(){
            
        },
        deleteParty:function(){
            
        }
	}
}]);