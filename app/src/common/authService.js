app.factory('authService',['$q','config',function($q,config){
    return{
        session:false,
        validateUser:function(user){
            return config.getData(config.login,'f={"id":1}&q='+user);
        },
        registerUser:function(){
            
        },
        checkValidity:function(){
            return this.session;
        }
    }
}]);