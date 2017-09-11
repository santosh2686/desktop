app.controller('addRegularRequestController',
  ['$scope',
    '$rootScope',
    '$q',
    '$filter',
    '$uibModalInstance',
    'requestService',
    'vehicleService',
    'driverService',
    'partyService',
    'packageService',
    'messageService',
    'record',
    'calculation',
    function ($scope,
              $rootScope,
              $q,
              $filter,
              $uibModalInstance,
              requestService,
              vehicleService,
              driverService,
              partyService,
              packageService,
              messageService,
              record,
              calculation) {
      'use strict';
      $scope.request = true;
      $scope.loading = false;
      $scope.action = record.action;
      var currDate = new Date(),
        newObj = {
          'requestType': 'local',
          'selectClient': 'party',
          'vehicleSelect': 'own',
          'startTrip': {
            'date': currDate
          },
          'endTrip': {
            'date': currDate
          },
          'openingKm': 0,
          'closingKm': 0,
          'totalKm': 0,
          'totalHr': 0,
          'totalDays': 0,
          'vehicle': {
            'AC': 'Yes'
          },
          'inDirect': {
            'AC': 'Yes'
          },
          'operator': {
            'AC': 'Yes'
          },
          'agency': {
            'AC': 'Yes'
          },
          'driverAllowance': 0,
          'advanceAmt': 0,
          'driverOverTime': 0,
          'tollAmt': 0,
          'parkingAmt': 0,
          'totalAmt': 0,
          'ownerTotal': 0,
          'profit': 0
        }, loadDependencies = function () {
          $q.all([vehicleService.getVehicle('own'),
            vehicleService.getVehicle('other'),
            driverService.getDriver(),
            partyService.getParty('client'),
            partyService.getParty('operator')]).then(function (res) {

            /*Own Vehicle List*/
            $scope.vehicleList = res[0].data[0].data;
            if (!vehicleService.vehicle.own) {
              vehicleService.vehicle.own = res[0].data;
            }

            /*Other Vehicle List*/
            $scope.oVehicleList = res[1].data[0].data;
            if (!vehicleService.vehicle.other) {
              vehicleService.vehicle.other = res[1].data;
            }

            /*Driver List*/
            $scope.driverList = res[2].data;
            if (!driverService.driver) {
              driverService.driver = res[2].data;
            }

            /*Client List*/
            $scope.partyList = res[3].data[0].data;
            if (!partyService.party.client) {
              partyService.party.client = res[3].data;
            }

            /*Operator List*/
            $scope.operatorList = res[4].data[0].data;
            if (!partyService.party.operator) {
              partyService.party.operator = res[4].data;
            }
            $scope.$watch('requestData.operator.operatorName', function (newVal, oldVal) {
              $scope.requestData.operator.vehicle = "";
              if (newVal) {
                $scope.operatorVehicleList = $filter('filter')($scope.operatorList, {'name': newVal})[0].vehicle;
              }
            });
            $scope.$watch('requestData.requestType', function (newVal, oldVal) {
              packageService.getPackage(newVal).then(function (res) {
                $scope.packageList = res.data[0].data;
                /*$scope.requestData.vehicle.partyPackage="";
                 $scope.requestData.inDirect.ownerPackage="";
                 $scope.requestData.inDirect.partyPackage="";

                 $scope.requestData.agency.agencyPackage="";
                 $scope.requestData.agency.partyPackage="";

                 $scope.requestData.operator.operatorPackage="";
                 $scope.requestData.operator.partyPackage="";*/

                if (!packageService.package[newVal]) {
                  packageService.package[newVal] = res.data;
                }
              });
            });
          });
        };

      if ($scope.action !== 'view') {
        loadDependencies();
      }
      $scope.requestData = ($scope.action === 'new') ? newObj : record.data[0];
      if (record.action == 'edit') {
        $scope.requestData.startTrip.date = new Date($scope.requestData.startTrip.date);
        $scope.requestData.endTrip.date = new Date($scope.requestData.endTrip.date);
        $scope.requestData.startTrip.time = new Date($scope.requestData.startTrip.time);
        $scope.requestData.endTrip.time = new Date($scope.requestData.endTrip.time);
        var recordId = $scope.requestData._id;
      }
      $scope.hideView = record.action === 'view';

      $scope.switchView = function () {
        $scope.request = !$scope.request;
      };
      $scope.closeModal = function () {
        $uibModalInstance.close();
      };
      $scope.calendar = {};
      $scope.openCalendar = function (type) {
        $scope.calendar[type] = true;
      };

      /*Calculations*/
      $scope.calculateTotalKm = function () {
        $scope.requestData.totalKm = ($scope.requestData.closingKm - $scope.requestData.openingKm);
      };
      $scope.calculateTotalHr = function () {
        $scope.requestData.totalHr = calculation.duration($scope.requestData.startTrip.date, $scope.requestData.endTrip.date, $scope.requestData.startTrip.time, $scope.requestData.endTrip.time) / 3600000;
        $scope.requestData.totalHr = $filter('number')($scope.requestData.totalHr, '2')
      };

      $scope.calculateTotalDays = function () {
        var noOfDays = Math.round(0.4 + calculation.duration($scope.requestData.startTrip.date, $scope.requestData.endTrip.date, $scope.requestData.startTrip.time, $scope.requestData.endTrip.time) / 86400000);
        $scope.requestData.totalDays = noOfDays <= 0 ? 1 : noOfDays;
      };
      $scope.calculateOutTotal = function (pgCode, pgName) {
        var tripTotal = 0;
        $scope.requestData.driverOverTime = 0;
        var partyPackage = $filter('filter')($scope.packageList, {'packageCode': pgCode})[0];
        if (pgName === 'party') {
          $scope.requestData.reqPackage = JSON.parse(angular.toJson(partyPackage));
        }
        tripTotal = tripTotal + $scope.requestData.totalDays * partyPackage.basicAmt;
        var extraKm = $scope.requestData.totalKm - (partyPackage.kmRate.minKm * $scope.requestData.totalDays);
        if (extraKm > 0) {
          tripTotal = tripTotal + (extraKm * partyPackage.kmRate.extraKm);
        }
        return tripTotal;
      };
      $scope.calculateTotal = function (pgCode, pgName) {
        var tripTotal = 0;
        var partyPackage = $filter('filter')($scope.packageList, {'packageCode': pgCode})[0];
        if (pgName === 'party') {
          $scope.requestData.reqPackage = JSON.parse(angular.toJson(partyPackage));
        }

        if ($scope.requestData.totalKm <= partyPackage.kmRate.minKm && $scope.requestData.totalHr <= partyPackage.hrRate.minHr) {
          $scope.requestData.driverOverTime = 0;
          tripTotal = tripTotal + partyPackage.basicAmt;
        }

        if ($scope.requestData.totalHr > partyPackage.hrRate.minHr && $scope.requestData.totalKm <= partyPackage.kmRate.minKm) {
          var baseHrAmt = (Math.floor($scope.requestData.totalHr / partyPackage.hrRate.minHr)) * partyPackage.basicAmt;
          var extraHrAmt = ($scope.requestData.totalHr % partyPackage.hrRate.minHr) * partyPackage.hrRate.extraHr;
          $scope.requestData.driverOverTime = ($scope.requestData.totalHr % 12) * 20;

          tripTotal = tripTotal + (baseHrAmt + extraHrAmt);
        }

        if ($scope.requestData.totalKm > partyPackage.kmRate.minKm && $scope.requestData.totalHr <= partyPackage.hrRate.minHr) {
          var baseKmAmt = (Math.floor($scope.requestData.totalKm / partyPackage.kmRate.minKm)) * partyPackage.basicAmt;
          var extraKm = ($scope.requestData.totalKm - partyPackage.kmRate.minKm)
          var extraKmAmt = extraKm > 0 ? extraKm * partyPackage.kmRate.extraKm : 0;
          $scope.requestData.driverOverTime = 0;
          tripTotal = tripTotal + (baseKmAmt + extraKmAmt);
        }

        if ($scope.requestData.totalKm > partyPackage.kmRate.minKm && $scope.requestData.totalHr > partyPackage.hrRate.minHr) {
          var baseHrAmt = (Math.floor($scope.requestData.totalHr / partyPackage.hrRate.minHr)) * partyPackage.basicAmt;
          var extraHrAmt = ($scope.requestData.totalHr % partyPackage.hrRate.minHr) * partyPackage.hrRate.extraHr;
          var extraKm = ($scope.requestData.totalKm - partyPackage.kmRate.minKm)
          var extraKmAmt = extraKm > 0 ? extraKm * partyPackage.kmRate.extraKm : 0;
          $scope.requestData.driverOverTime = ($scope.requestData.totalHr % 12) * 20;
          tripTotal = tripTotal + (baseHrAmt + extraHrAmt + extraKmAmt);
        }

        return tripTotal;

      };
      $scope.calculate = function () {
        switch ($scope.requestData.vehicleSelect) {
          case 'own': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.vehicle.partyPackage, 'party');
            } else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.vehicle.partyPackage, 'party');
            }
            $scope.requestData.profit = ($scope.requestData.totalAmt - $scope.requestData.driverAllowance - $scope.requestData.driverOverTime);
            break;
          }
          case 'indirect': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.inDirect.partyPackage, 'party');
              $scope.requestData.ownerTotal = $scope.calculateOutTotal($scope.requestData.inDirect.ownerPackage, 'owner');
              $scope.requestData.profit = $scope.requestData.totalAmt - $scope.requestData.ownerTotal;
            } else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.inDirect.partyPackage, 'party');
              $scope.requestData.ownerTotal = $scope.calculateTotal($scope.requestData.inDirect.ownerPackage, 'owner');
              $scope.requestData.profit = $scope.requestData.totalAmt - $scope.requestData.ownerTotal;
            }
            break;
          }
          case 'operator': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.operator.partyPackage, 'party');
              $scope.requestData.ownerTotal = $scope.calculateOutTotal($scope.requestData.operator.operatorPackage, 'owner');
              $scope.requestData.profit = $scope.requestData.totalAmt - $scope.requestData.ownerTotal;
            } else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.operator.partyPackage, 'party');
              $scope.requestData.ownerTotal = $scope.calculateTotal($scope.requestData.operator.operatorPackage, 'owner');

              $scope.requestData.profit = $scope.requestData.totalAmt - $scope.requestData.ownerTotal;
            }
            break;
          }
          case 'other': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.agency.partyPackage, 'party');
              $scope.requestData.ownerTotal = $scope.calculateOutTotal($scope.requestData.agency.agencyPackage, 'owner');
              $scope.requestData.profit = $scope.requestData.totalAmt - $scope.requestData.ownerTotal;
            } else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.agency.partyPackage, 'party');
              $scope.requestData.ownerTotal = $scope.calculateTotal($scope.requestData.agency.agencyPackage, 'owner');
              $scope.requestData.profit = $scope.requestData.totalAmt - $scope.requestData.ownerTotal;
            }
            break;
          }
        }
      };
      $scope.submitRequest = function () {
        $scope.loading = true;

        if ($scope.requestData.vehicleSelect === 'operator') {
          $scope.requestData.operator.vehicleName = $scope.requestData.operator.vehicle.split(',')[0];
          $scope.requestData.operator.vehicleNo = $scope.requestData.operator.vehicle.split(',')[1];
        }
        $scope.requestData.month = $filter('date')($scope.requestData.startTrip.date, "MMM");
        $scope.requestData.year = $filter('date')($scope.requestData.startTrip.date, "yyyy");

        if ($scope.action === 'new') {
          requestService.addRequest('regular', $scope.requestData).then(function (res) {
            $scope.closeModal();
            requestService.request.regular = null;
            $rootScope.$emit('regularRequest');
            messageService.showMessage({
              'type': 'success',
              'title': 'Regular Request',
              'text': 'New regular request added successfully.'
            });
          }, function () {
            $scope.closeModal();
            messageService.showMessage({
              'type': 'error',
              'title': 'Regular Request',
              'text': 'New regular request not added successfully. Please try again.'
            });
          });
        } else {
          delete $scope.requestData._id;
          requestService.updateRequest('regular', recordId, JSON.parse(angular.toJson($scope.requestData))).then(function (res) {
            $scope.closeModal();
            requestService.request.regular = null;
            $rootScope.$emit('regularRequest');
            messageService.showMessage({
              'type': 'success',
              'title': 'Regular Request',
              'text': 'Regular request Updated successfully.'
            });
          }, function () {
            $scope.closeModal();
            messageService.showMessage({
              'type': 'error',
              'title': 'Regular Request',
              'text': 'Request not Updated successfully. Please try again.'
            });
          });
        }
      }
    }]);
