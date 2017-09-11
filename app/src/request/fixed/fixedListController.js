app.controller('fixedListController', ['$scope', '$rootScope', '$filter', 'requestService', 'config', 'partyService', 'messageService', 'pdfService',
  function ($scope, $rootScope, $filter, requestService, config, partyService, messageService, pdfService) {
    $scope.data = [];
    $scope.localEnv = config.local;
    $scope.loading = true;
    $scope.currMonth = new Date().getMonth();
    $scope.monthList = config.months;
    var initialData;
    $scope.filter = {
      'type': 'party'
    };
    $scope.filter.month = $scope.monthList[$scope.currMonth];
    var pagination = function () {
        $scope.loading = false;
        $scope.totalItems = $scope.data.length;
        $scope.currentPage = requestService.request.pager.currentPage;
        $scope.itemsPerPage = requestService.request.pager.itemsPerPage;
        $scope.maxSize = requestService.request.pager.maxSize;
      },
      success = function (res) {
        $scope.data = res.data;
        initialData = angular.copy($scope.data);
        if (!requestService.request.fixed) {
          requestService.request.fixed = res.data;
        }
        pagination();
      },
      init = function () {
        requestService.getRequest('fixed', 's={"date":-1}').then(success);
      };

    partyService.getParty('client').then(function (res) {
      $scope.partyList = res.data[0].data;
      if (!partyService.party.client) {
        partyService.party.client = res.data;
      }
      init();
    });

    $rootScope.$on('fixedRequest', function () {
      init();
    });

    $scope.applyFilter = function () {
      $scope.data = $filter('filter')(initialData, {"partyName": $scope.filter.party, "month": $scope.filter.month});
    };
    $scope.clearFilter = function () {
      $scope.data = initialData;
      $scope.filter.party = "";
      $scope.filter.month = $scope.monthList[$scope.currMonth];
    };


    $scope.newRequest = function (template, controller) {
      requestService.newRequest('fixed', template, controller);
    };

    $scope.viewRequest = function (template, controller, id) {
      requestService.viewRequest('fixed', template, controller, id);
    };

    $scope.editRequest = function (template, controller, id) {
      requestService.editRequest('fixed', template, controller, id);
    };

    $scope.deleteRequest = function (id) {
      messageService.deleteConfirm().result.then(function (data) {
        if (data) {
          $scope.deleteRecord(id);
        }
      });
    };
    $scope.deleteRecord = function (id) {
      requestService.deleteRequest('fixed', id).then(function (res) {
        requestService.request.fixed = null;
        init();
        messageService.showMessage({
          'type': 'success',
          'title': 'Fixed Request',
          'text': 'Fixed Request Deleted successfully.'
        });
      }, function () {
        messageService.showMessage({
          'type': 'error',
          'title': 'Fixed Request',
          'text': 'Fixed Request can not be deleted at this time. Please try again.'
        });
      });
    };
    $scope.processForFixedpdf = function (data) {
      var rowData = [];
      for (var i = 0; i < data.length; i++) {
        var rowItem = [i + 1, $filter('date')(data[i].date, 'dd-MMM-yyyy'), data[i].partyName, data[i].requestType === 'local' ? 'Local' : 'Out Station', data[i].vehicleSelect, data[i].vehicleSelect === "daily" ? data[i].vehicle : data[i].vehicleSelect === "own" ? data[i].own.vehicle : data[i].vehicleSelect === "indirect" ? data[i].inDirect.vehicle : data[i].vehicleSelect === "operator" ? data[i].operator.vehicleName + ',' + data[i].operator.vehicleNo : data[i].agency.vehicleName + ',' + data[i].agency.vehicleNo, (data[i].vehicleSelect === "daily" || data[i].vehicleSelect === "own") ? data[i].driver : data[i].vehicleSelect === "indirect" ? data[i].inDirect.driver : data[i].vehicleSelect === "operator" ? data[i].operator.driver : data[i].agency.driver, data[i].totalKm + ' KM', data[i].extraHr];
        rowData.push(rowItem);
      }
      return rowData;
    };

    $scope.exportData = function () {
      var columns = ['Sr. No', 'Date', 'Client Name', 'Request Type', 'Vehicle Provided', 'Vehicle', 'Driver', 'Total KM', 'Extra HR'];
      pdfService.buildPDF(columns, $scope.processForFixedpdf($scope.data), 'Fixed Requests', 'Fixed_Requests');
    }

  }]);
