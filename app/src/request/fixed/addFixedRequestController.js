app.controller('addFixedRequestController',
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
      $scope.request = true;
      $scope.loading = false;
      $scope.action = record.action;
      var currDate = new Date(),
        newObj = {
          'vehicleSelect': 'daily',
          'requestType': 'local',
          'regularVehicle': 'own',
          'nightHaltAmt': 0,
          'date': currDate,
          'diverAllowanceAmt': 0,
          'openingKm': 0,
          'closingKm': 0,
          'totalKm': 0,
          'startTime': '',
          'totalHr': 0,
          'extraHr': 0,
          'own': {},
          'inDirect': {},
          'operator': {},
          'agency': {},
          'tollAmt': 0,
          'parkingAmt': 0,
          'totalAmt': 0,
          'driverOverTime': 0
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

            $scope.$watch('[requestData.regularVehicle,requestData.partyName]', function (newVal, oldVal) {
              switch ($scope.requestData.regularVehicle) {
                case 'indirect': {
                  $scope.regularVehicleList = $filter('filter')($scope.oVehicleList, {
                    'selectFixed': 'Yes',
                    'fixed': {'companyName': $scope.requestData.partyName}
                  });
                  break;
                }
                default: {
                  $scope.regularVehicleList = $filter('filter')($scope.vehicleList, {
                    'selectFixed': 'Yes',
                    'fixed': {'companyName': $scope.requestData.partyName}
                  });
                  break;
                }
              }
              if ($scope.regularVehicleList && $scope.regularVehicleList.length > 0 && $scope.action === 'new') {
                $scope.requestData.vehicle = $scope.regularVehicleList[0].vehicleName + ',' + $scope.regularVehicleList[0].vehicleNo;
              }
            });

            $scope.$watch('requestData.operator.operatorName', function (newVal, oldVal) {
              $scope.requestData.operator.vehicle = "";
              if (newVal) {
                $scope.operatorVehicleList = $filter('filter')($scope.operatorList, {'name': newVal})[0].vehicle;
              }
            });

            $scope.$watch('requestData.requestType', function (newVal, oldVal) {
              packageService.getPackage(newVal).then(function (res) {
                $scope.packageList = res.data[0].data;
                $scope.requestData.inDirect.ownerPackage = "";
                $scope.requestData.inDirect.partyPackage = "";

                $scope.requestData.agency.agencyPackage = "";
                $scope.requestData.agency.partyPackage = "";

                $scope.requestData.operator.operatorPackage = "";
                $scope.requestData.operator.partyPackage = "";

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

      $scope.requestData = (record.action === 'new') ? newObj : record.data[0];
      if (record.action == 'edit') {
        $scope.requestData.date = new Date($scope.requestData.date);
        $scope.requestData.startTime = new Date($scope.requestData.startTime);
        $scope.requestData.endTime = new Date($scope.requestData.endTime);
        var recordId = $scope.requestData._id;
      }
      $scope.hideView = (record.action === 'view');

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

      $scope.calculateTotalKm = function () {
        $scope.requestData.totalKm = ($scope.requestData.closingKm - $scope.requestData.openingKm);
      };

      $scope.calculateTotalHr = function () {
        $scope.requestData.totalHr = $filter('number')($scope.calDuration() / 3600000, '2');
        $scope.requestData.extraHr = $scope.requestData.totalHr > 12 ? $scope.requestData.totalHr - 12 : 0;
        if ($scope.requestData.requestType === 'out') {
          var noOfDays = Math.round(0.4 + $scope.calDuration() / 86400000);
          $scope.requestData.totalDays = noOfDays <= 0 ? 1 : noOfDays;
        } else {
          $scope.requestData.driverOverTime = $scope.requestData.extraHr * 20;
        }
      };
      $scope.calDuration = function () {
        var sDate = $scope.requestData.date;
        var sTime = $scope.requestData.startTime;
        var eDate = $scope.requestData.date;
        var eTime = $scope.requestData.endTime;

        var buildSDate = sDate.getFullYear() + '/' + (sDate.getMonth() + 1) + '/' + sDate.getDate();
        var buildSTime = sTime.getHours() + ':' + sTime.getMinutes() + ':' + sTime.getSeconds();
        var startTimeStamp = new Date(buildSDate + ' ' + buildSTime);

        var buildEDate = eDate.getFullYear() + '/' + (eDate.getMonth() + 1) + '/' + eDate.getDate();
        var buildETime = eTime.getHours() + ':' + eTime.getMinutes() + ':' + eTime.getSeconds();
        var EndTimeStamp = new Date(buildEDate + " " + buildETime);
        return (EndTimeStamp - startTimeStamp);
      }
      $scope.calculateOutTotal = function (pgCode) {
        var tripOutTotal = 0;
        var partyPackage = $filter('filter')($scope.packageList, {'packageCode': pgCode})[0];
        tripOutTotal = tripOutTotal + $scope.requestData.totalDays * partyPackage.basicAmt;
        var extraKm = $scope.requestData.totalKm - (partyPackage.kmRate.minKm * $scope.requestData.totalDays);
        if (extraKm > 0) {
          tripOutTotal = tripOutTotal + (extraKm * partyPackage.kmRate.extraKm);
        }
        return tripOutTotal + $scope.requestData.tollAmt + $scope.requestData.parkingAmt;
      };

      $scope.calculateTotal = function (pgCode) {
        var tripTotal = 0;
        var partyPackage = $filter('filter')($scope.packageList, {'packageCode': pgCode})[0];

        if ($scope.requestData.totalKm <= partyPackage.kmRate.minKm && $scope.requestData.totalHr <= partyPackage.hrRate.minHr) {
          tripTotal = tripTotal + partyPackage.basicAmt;
        }

        if ($scope.requestData.totalHr > partyPackage.hrRate.minHr && $scope.requestData.totalKm <= partyPackage.kmRate.minKm) {
          var baseHrAmt = (Math.floor($scope.requestData.totalHr / partyPackage.hrRate.minHr)) * partyPackage.basicAmt;
          var extraHrAmt = ($scope.requestData.totalHr % partyPackage.hrRate.minHr) * partyPackage.hrRate.extraHr;
          tripTotal = tripTotal + (baseHrAmt + extraHrAmt);
        }

        if ($scope.requestData.totalKm > partyPackage.kmRate.minKm && $scope.requestData.totalHr <= partyPackage.hrRate.minHr) {
          var baseKmAmt = (Math.floor($scope.requestData.totalKm / partyPackage.kmRate.minKm)) * partyPackage.basicAmt;
          var extraKmAmt = ($scope.requestData.totalKm % partyPackage.kmRate.minKm) * partyPackage.kmRate.extraKm;

          tripTotal = tripTotal + (baseKmAmt + extraKmAmt);
        }

        if ($scope.requestData.totalKm > partyPackage.kmRate.minKm && $scope.requestData.totalHr > partyPackage.hrRate.minHr) {
          var baseHrAmt = (Math.floor($scope.requestData.totalHr / partyPackage.hrRate.minHr)) * partyPackage.basicAmt;
          var extraHrAmt = ($scope.requestData.totalHr % partyPackage.hrRate.minHr) * partyPackage.hrRate.extraHr;
          var extraKmAmt = ($scope.requestData.totalKm % partyPackage.kmRate.minKm) * partyPackage.kmRate.extraKm;

          tripTotal = tripTotal + (baseHrAmt + extraHrAmt + extraKmAmt);
        }

        return tripTotal + $scope.requestData.tollAmt + $scope.requestData.parkingAmt;

      };

      $scope.calculate = function () {
        switch ($scope.requestData.vehicleSelect) {
          case 'indirect': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.inDirect.ownerPackage);
            }
            else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.inDirect.ownerPackage);
            }
            break;
          }
          case 'operator': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.operator.operatorPackage);
            }
            else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.operator.operatorPackage);
            }
            break;
          }
          case 'other': {
            if ($scope.requestData.requestType === 'out') {
              $scope.requestData.totalAmt = $scope.calculateOutTotal($scope.requestData.agency.agencyPackage);
            } else {
              $scope.requestData.totalAmt = $scope.calculateTotal($scope.requestData.agency.agencyPackage);
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
        $scope.requestData.month = $filter('date')($scope.requestData.date, "MMM");
        $scope.requestData.year = $filter('date')($scope.requestData.date, "yyyy");
        if ($scope.action === 'new') {
          requestService.addRequest('fixed', $scope.requestData).then(function (res) {
            $scope.closeModal();
            requestService.request.fixed = null;
            $rootScope.$emit('fixedRequest');
            messageService.showMessage({
              'type': 'success',
              'title': 'Fixed Request',
              'text': 'New fixed request added successfully.'
            });
          }, function () {
            $scope.closeModal();
            messageService.showMessage({
              'type': 'error',
              'title': 'Fixed Request',
              'text': 'New fixed request not added successfully. Please try again.'
            });
          });
        } else {
          delete $scope.requestData._id;
          requestService.updateRequest('fixed', recordId, JSON.parse(angular.toJson($scope.requestData))).then(function (res) {
            $scope.closeModal();
            requestService.request.fixed = null;
            $rootScope.$emit('fixedRequest');
            messageService.showMessage({
              'type': 'success',
              'title': 'Fixed Request',
              'text': 'Fixed request Updated successfully.'
            });
          }, function () {
            $scope.closeModal();
            messageService.showMessage({
              'type': 'error',
              'title': 'Fixed Request',
              'text': 'Fixed not Updated successfully. Please try again.'
            });
          });
        }
      }
    }]);
