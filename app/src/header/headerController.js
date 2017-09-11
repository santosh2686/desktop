app.controller('headerController', ['$scope', '$state', '$http', 'requestService', 'vehicleService',
  'packageService', 'driverService', 'partyService', 'expenseService',
  function ($scope, $state, $http, requestService, vehicleService, packageService, driverService, partyService, expenseService) {
    $scope.logOut = function () {

      requestService.request.regular = null;
      requestService.request.fixed = null;

      packageService.package.local = null;
      packageService.package.out = null;
      packageService.package.fix = null;

      vehicleService.vehicle.own = null;
      vehicleService.vehicle.other = null;

      driverService.driver = null;

      partyService.party.client = null;
      partyService.party.operator = null;

      expenseService.expense.vehicleExpense = null;
      expenseService.expense.driverExpense = null;

      $http.get('/logout').then(function (res) {
        $state.go('login');
      }, function () {
        console.log('ERROR');
      });
    }
  }]);