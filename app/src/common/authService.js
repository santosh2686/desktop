app.factory('authService',['$q','config',function($q,config){
    return{
        getUser:function(user){
            return config.validateUser(config.login,'f={"id":1}&q='+user);
        },
        registerUser:function(){
            
        }
    }
}]);