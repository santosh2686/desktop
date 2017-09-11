app.factory('authService', ['$q', 'config', function ($http, $q, config) {
  return {
    session: false,
    validateUser: function (user) {
      return config.getData(config.login, 'f={"id":1}&q=' + user);
    }
  }
}]);