app.factory('expenseService',['$uibModal','$filter','$q','config',function($uibModal,$filter,$q,config){
	return{
      expense:{
            'vehicleExpense':null,
            'driverExpense':null,
        },
        getExpense:function(type){
            return this.expense[type]?$q.resolve({data:this.expense[type]}):config.getData(config[type],'s={"date":-1}');
        },
        addExpense:function(){
            
        },
        editExpense:function(){

        },
        viewExpense:function(){

        },
        deleteExpense:function(){

        }
	}
}]);