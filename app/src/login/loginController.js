app.controller('loginController', ['$http', '$scope', '$state', 'authService', function ($http, $scope, $state, authService) {
  'use strict';
  $scope.loginData = {
    userName: '',
    password: ''
  };
  $scope.showAlert = false;
  $scope.loading = false;
  $scope.signIn = function () {
    $scope.loading = true;

    $http.get('/login?userName=' + $scope.loginData.userName + '&password=' + $scope.loginData.password).then(function (res) {
      $scope.loading = false;
      $scope.showAlert = false;
      $state.go('request.regular');
    }, function () {
      $scope.loading = false;
      $scope.showAlert = true;
    });
  }
}]);
