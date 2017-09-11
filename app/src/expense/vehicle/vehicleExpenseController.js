app.controller('vehicleExpenseController',
  ['$scope', '$state', '$rootScope', '$filter', 'expenseService', 'requestService', 'vehicleService', 'messageService', 'pdfService', '$uibModal', 'config',
    function ($scope, $state, $rootScope, $filter, expenseService, requestService, vehicleService, messageService, pdfService, $uibModal, config) {
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
          if (!expenseService.expense.vehicleExpense) {
            expenseService.expense.vehicleExpense = res.data;
          }
          $scope.loading = false;
          pagination();
        },
        expenseModal = function (type, data) {
          $uibModal.open({
            templateUrl: 'expense/vehicle/add-vehicle-expense.html',
            controller: 'addVehicleExpenseController',
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
        },
        init = function () {
          expenseService.getExpense('vehicleExpense', 's={"date":-1}').then(success, function () {
            $state.go('login');
          });
        },
        setFuelData = function (row) {
          if (row.expenseName == 'fuel') {
            return row.expenseName.toUpperCase() + ', Fule Rate : ' + row.fuelRate + '\n Current KM : ' + row.currKm;
          } else {
            return row.expenseName.toUpperCase();
          }
        },
        setPayMode = function (row) {
          if (row.paymentMode == 'credit') {
            return 'CREDIT \n CARD NO: ' + row.credit.cardName;
          }
          if (row.paymentMode == 'cheque') {
            return 'CHEQUE \n BANK NAME: ' + row.cheque.bankName;
          } else {
            return row.paymentMode.toUpperCase();
          }
        },
        buildData = function (data) {
          var rowData = [];
          for (var i = 0; i < data.length; i++) {
            var rowItem = [i + 1, $filter('date')(data[i].date, 'dd-MMM-yyyy'), setFuelData(data[i]), data[i].location, data[i].vehicle, $filter('number')(data[i].expenseAmt, '2') + '/-', setPayMode(data[i]), data[i].comments];
            rowData.push(rowItem);
          }
          return rowData;
        };

      init();
      $rootScope.$on('vehicleExpense', function () {
        init();
      });

      vehicleService.getVehicle('own').then(function (res) {
        $scope.vehicleList = res.data[0].data;
        if (!vehicleService.vehicle.own) {
          vehicleService.vehicle.own = res.data;
        }
      });
      $scope.applyFilter = function () {
        $scope.data = $filter('filter')(initialData, {"vehicle": $scope.filter.vehicle, "month": $scope.filter.month});
      };
      $scope.clearFilter = function () {
        $scope.data = initialData;
        $scope.filter.vehicle = "";
        $scope.filter.month = $scope.monthList[$scope.currMonth];
      };
      $scope.newExpense = function () {
        expenseModal('new', {});
      };
      $scope.viewRequest = function (id) {
        expenseModal('view', expenseService.filterRecord('vehicleExpense', id)[0]);
      };
      $scope.editRequest = function (id) {
        expenseModal('edit', expenseService.filterRecord('vehicleExpense', id)[0]);
      };
      $scope.deleteRequest = function (id) {
        messageService.deleteConfirm().result.then(function (data) {
          if (data) {
            $scope.deleteRecord(id);
          }
        });
      };
      $scope.deleteRecord = function (id) {
        expenseService.deleteExpense('vehicleExpense', id).then(function () {
          expenseService.expense['vehicleExpense'] = null;
          init();
          messageService.showMessage({
            'type': 'success',
            'title': 'Vehicle Expense',
            'text': 'Vehicle expense deleted successfully.'
          });
        }, function () {
          messageService.showMessage({
            'type': 'error',
            'title': 'Vehicle Expense',
            'text': 'Vehicle expense not deleted successfully. Please try again.'
          });
        });
      };
      $scope.exportData = function () {
        var columns = ['Sr. No', 'Date', 'Expense Type', 'Location', 'Vehicle', 'Expense Amount', 'Payment Mode', 'Comments'];
        pdfService.buildPDF(columns, buildData($scope.data), 'Vehicle Expenses', 'Vehicle_expense', 5);
      };
    }]);