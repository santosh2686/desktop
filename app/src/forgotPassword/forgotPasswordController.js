app.controller('forgotPasswordController', ['$scope', '$http', function ($scope, $http) {
  $scope.email = '';
  $scope.submit = function () {
    $http.get('/forgotPassword?email=' + $scope.email).then(function (res) {
      console.log('SUCCESS');
    }, function () {
      console.log('ERROR');
    });
  }
}]);
