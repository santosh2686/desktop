app.factory('authService',['$q','config',function($q,config){
    return{
        getUser:function(user){
            return config.getData(config.login,'f={"id":1}&q='+user);
        },
        addUser:function(){
            
        }
    }
}]);