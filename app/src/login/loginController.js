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

    $http.get('/login?userName='+$scope.loginData.userName+'&password='+$scope.loginData.password).then(function (res) {
      $scope.loading = false;
      $scope.showAlert = false;
      $state.go('dashboard');
    }, function () {
      $scope.loading = false;
      $scope.showAlert = true;
    });

 /*   authService.validateUser(JSON.stringify($scope.loginData)).then(function (res) {
      $scope.loading = false;
      if (res.data.length === 1) {
        $scope.showAlert = false;
        authService.session = true;
        sessionStorage.setItem('id', res.data[0]._id.$oid);
        $state.go('dashboard');
      } else {
        $scope.showAlert = true;
      }
    }, function () {
      authService.session = false;
    });*/
  }
}]);
