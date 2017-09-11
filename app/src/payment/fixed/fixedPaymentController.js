app.controller('fixedPaymentController', ['$scope', '$q', '$filter', 'config', 'vehicleService', 'partyService', 'requestService', 'packageService', 'pdfService',
  function ($scope, $q, $filter, config, vehicleService, partyService, requestService, packageService, pdfService) {
    var initialVehicleData;
    $scope.data = null;
    $scope.localEnv = config.local;
    $scope.loading = false;
    $scope.currMonth = new Date().getMonth();
    $scope.monthList = config.months;
    $scope.yearList = config.years();
    $scope.filter = {};
    $scope.filter.year = new Date().getFullYear().toString();
    $scope.filter.month = $scope.monthList[$scope.currMonth];

    $q.all([vehicleService.getVehicle('own'), partyService.getParty('client')]).then(function (res) {
      $scope.vehicleList = $filter('filter')(res[0].data[0].data, {'selectFixed': 'Yes'});
      initialVehicleData = angular.copy($scope.vehicleList);
      if (!vehicleService.vehicle.own) {
        vehicleService.vehicle.own = res[0].data;
      }
      $scope.partyList = res[1].data[0].data;
      if (!partyService.party.client) {
        partyService.party.client = res[1].data;
      }
    });

    $scope.$watch('filter.party', function (newValue, oldValue) {
      $scope.filter.vehicle = "";
      if (!newValue) {
        return;
      }
      ;
      $scope.vehicleList = $filter('filter')(initialVehicleData, {'fixed': {'companyName': newValue}});
    });
    $scope.calculatePayment = function () {
      $scope.data = [];
      $scope.loading = true;
      if (requestService.request.fixed) {
        $scope.data = $filter('filter')(requestService.request.fixed, {
          "partyName": $scope.filter.party,
          "vehicle": $scope.filter.vehicle,
          "month": $scope.filter.month,
          "year": $scope.filter.year
        });
        $scope.loading = false;
        getPackageData();
      } else {
        requestService.getRequest("fixed", 'q={"partyName":"' + $scope.filter.party + '","vehicle":"' + $scope.filter.vehicle + '","month":"' + $scope.filter.month + '","year":"' + $scope.filter.year + '"}&s={"date":-1}').then(function (res) {
          $scope.loading = false;
          $scope.data = res.data;
          getPackageData();
        });
      }
    }

    var getPackageData = function () {
        var packageCode = $filter('filter')(initialVehicleData, {
          'vehicleName': $scope.filter.vehicle.split(',')[0],
          'vehicleNo': $scope.filter.vehicle.split(',')[1]
        })[0].fixed.package;
        packageService.getPackage('fix').then(function (res) {
          var pkg = ($filter('filter')(res.data[0].data, {'packageCode': packageCode})[0]);
          calculateTotalAmt(pkg);
        });
      },
      calculateTotalAmt = function (pkg) {
        $scope.allData = {
          'basicAmt': pkg.basicAmt,
          'basicKM': pkg.kmRate.minKm,
          'extraKmRate': pkg.kmRate.extraKm,
          'extraHrRate': pkg.hrRate.extraHr,
          'totalKm': 0,
          'extraHr': 0,
          'DAAmt': 0,
          'DAAmtCount': 0,
          'nightHaltAmt': 0,
          'nightHaltAmtCount': 0,
          'overTimeAmt': 0,
          'tollAmt': 0,
          'parkingAmt': 0,
          'monthTotal': 0
        };
        for (var i = 0; i < $scope.data.length; i++) {
          $scope.allData.totalKm += $scope.data[i].totalKm;
          $scope.allData.extraHr += $scope.data[i].extraHr;
          $scope.allData.DAAmt += $scope.data[i].diverAllowanceAmt;
          if ($scope.data[i].diverAllowanceAmt > 0) {
            $scope.allData.DAAmtCount++;
          }
          $scope.allData.nightHaltAmt += $scope.data[i].nightHaltAmt;
          if ($scope.data[i].nightHaltAmt > 0) {
            $scope.allData.nightHaltAmtCount++;
          }
          $scope.allData.overTimeAmt += $scope.data[i].driverOverTime;
          $scope.allData.tollAmt += $scope.data[i].tollAmt;
          $scope.allData.parkingAmt += $scope.data[i].parkingAmt;
        }
        $scope.allData.monthTotal = ($scope.allData.totalKm <= $scope.allData.basicKM ? $scope.allData.basicAmt : $scope.allData.basicAmt + ($scope.allData.totalKm - $scope.allData.basicKM) * pkg.kmRate.extraKm) + ($scope.allData.extraHr * pkg.hrRate.extraHr) + $scope.allData.DAAmt + $scope.allData.nightHaltAmt + $scope.allData.tollAmt + $scope.allData.parkingAmt;
      },
      processForFixedpdf = function (data) {
        var rowData = [];
        for (var i = 0; i < data.length; i++) {
          var rowItem = [i + 1, $filter('date')(data[i].date, 'dd-MMM-yyyy'), data[i].requestType == 'local' ? 'Local' : 'Out Station', data[i].totalKm + ' KM', data[i].extraHr + ' Hr', $filter('number')(data[i].diverAllowanceAmt, '2') + '/-', $filter('number')(data[i].nightHaltAmt, '2') + '/-', $filter('number')(data[i].tollAmt, '2') + '/-', $filter('number')(data[i].parkingAmt, '2') + '/-'];
          rowData.push(rowItem);
        }
        return rowData;
      };

    $scope.exportData = function () {
      var columns = ['Sr. No', 'Date', 'Request Type', 'Trip KM', 'Extra Hours', 'Driver Allowance', 'Night Halt', 'Toll Amount', 'Parking Amount'];
      pdfService.buildPDF(columns, processForFixedpdf($scope.data), 'Fixed Payments', 'Fixed_Payments', 0, 'Party Name : ' + $scope.filter.party + ',  Vehicle Name : ' + $scope.filter.vehicle + ',  Month : ' + $scope.filter.month + ',  Year : ' + $scope.filter.year + '  ::  Total Amount : ' + $filter('number')($scope.allData.monthTotal, '2') + '/-');
    };

  }]);