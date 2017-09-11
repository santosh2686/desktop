app.controller('forgotPasswordController', ['$scope', '$http', function ($scope, $http) {
  $scope.email = '';
  $scope.submit = function () {
    console.log($scope.email);
  }
}]);
