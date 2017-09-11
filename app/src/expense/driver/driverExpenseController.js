app.controller('driverExpenseController', ['$scope', '$rootScope', '$filter', 'expenseService', 'requestService', 'driverService', 'messageService', 'pdfService', '$uibModal', 'config',
  function ($scope, $rootScope, $filter, expenseService, requestService, driverService, messageService, pdfService, $uibModal, config) {
    $scope.data = [];
    $scope.loading = true;
    $scope.localEnv = config.local;
    $scope.currMonth = new Date().getMonth();
    $scope.monthList = config.months;
    $scope.filter = {};
    $scope.filter.month = $scope.monthList[$scope.currMonth];
    var initialData,
      pagination = function () {
        $scope.loading = false;
        $scope.totalItems = $scope.data.length;
        $scope.currentPage = requestService.request.pager.currentPage;
        $scope.itemsPerPage = requestService.request.pager.itemsPerPage;
        $scope.maxSize = requestService.request.pager.maxSize;
      },
      success = function (res) {
        $scope.data = res.data;
        initialData = angular.copy($scope.data);
        if (!expenseService.expense.driverExpense) {
          expenseService.expense.driverExpense = res.data;
        }
        $scope.loading = false;
        pagination();
      },
      expenseModal = function (type, data) {
        $uibModal.open({
          templateUrl: 'expense/driver/add-driver-expense.html',
          controller: 'addDriverExpenseController',
          size: 'lg',
          resolve: {
            record: function () {
              return {
                'action': type,
                'data': data
              };
            }
          }
        });
      }, init = function () {
        expenseService.getExpense('driverExpense', 's={"date":-1}').then(success);
      };
    init();
    $rootScope.$on('driverExpense', function () {
      init();
    });
    driverService.getDriver().then(function (res) {
      $scope.driverList = res.data;
      if (!driverService.driver) {
        driverService.driver = res.data;
      }
    });
    $scope.applyFilter = function () {
      $scope.data = $filter('filter')(initialData, {"driver": $scope.filter.driver, "month": $scope.filter.month});
    };
    $scope.clearFilter = function () {
      $scope.data = initialData;
      $scope.filter.driver = "";
      $scope.filter.month = $scope.monthList[$scope.currMonth];
    };
    $scope.newExpense = function () {
      expenseModal('new', {});
    };
    $scope.viewRequest = function (id) {
      expenseModal('view', expenseService.filterRecord('driverExpense', id)[0]);
    };
    $scope.editRequest = function (id) {
      expenseModal('edit', expenseService.filterRecord('driverExpense', id)[0]);
    };
    $scope.deleteRequest = function (id) {
      messageService.deleteConfirm().result.then(function (data) {
        if (data) {
          $scope.deleteRecord(id);
        }
      });
    };
    $scope.deleteRecord = function (id) {
      expenseService.deleteExpense('driverExpense', id).then(function () {
        expenseService.expense['driverExpense'] = null;
        init();
        messageService.showMessage({
          'type': 'success',
          'title': 'Driver Expense',
          'text': 'Driver expense deleted successfully.'
        });
      }, function () {
        messageService.showMessage({
          'type': 'error',
          'title': 'Driver Expense',
          'text': 'Driver expense not deleted successfully. Please try again.'
        });
      });
    };
    $scope.buildData = function (data) {
      var rowData = [];
      for (var i = 0; i < data.length; i++) {
        var rowItem = [i + 1, $filter('date')(data[i].date, 'dd-MMM-yyyy'), data[i].driver, $filter('number')(data[i].expenseAmt, '2') + '/-', $filter('number')(data[i].tollExpenseAmt, '2') + '/-', $filter('number')((data[i].expenseAmt + data[i].tollExpenseAmt), '2') + '/-', data[i].comments];
        rowData.push(rowItem);
      }
      return rowData;
    };
    $scope.exportData = function () {
      var columns = ['Sr. No', 'Date', 'Driver', 'Self Advanced', 'Toll Advanced', 'Total Advanced', 'Comments'];
      pdfService.buildPDF(columns, $scope.buildData($scope.data), 'Driver Expenses', 'Driver_expense');
    };
  }]);