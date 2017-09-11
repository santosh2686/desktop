app.controller('otherVehicleController', ['$scope', '$rootScope', '$uibModal', 'vehicleService', 'messageService', 'gridMap', function ($scope, $rootScope, $uibModal, vehicleService, messageService, gridMap) {
  $scope.data = [];
  $scope.gridConfig = gridMap.VEHICLE.OTHER;
  $scope.loading = true;
  var success = function (res) {
      $scope.data = res.data[0].data;
      if (!vehicleService.vehicle.other) {
        vehicleService.vehicle.other = res.data;
      }
      $scope.loading = false;
    },
    init = function () {
      vehicleService.getVehicle('other').then(success);
    },
    vehicleModal = function (action, data) {
      $uibModal.open({
        templateUrl: 'vehicle/vehicle-modal.html',
        controller: 'vehicleModalController',
        size: 'lg',
        resolve: {
          record: function () {
            return {
              'action': action,
              'type': 'other',
              'data': data
            };
          }
        }
      });
    };
  $rootScope.$on('otherVehicle', function () {
    init();
  });
  init();

  $scope.newVehicle = function () {
    vehicleModal('new', {});
  };
  $scope.view = function (id) {
    vehicleModal('view', vehicleService.filterRecord('other', id)[0]);
  };
  $scope.edit = function (id) {
    vehicleModal('edit', vehicleService.filterRecord('other', id)[0]);
  };
  $scope.delete = function (id) {
    messageService.deleteConfirm().result.then(function (data) {
      if (data) {
        $scope.deleteRecord(id);
      }
    });
  };
  $scope.deleteRecord = function (id) {
    var vehName = vehicleService.filterRecord('other', id)[0].vehicleName;
    vehicleService.deleteVehicle('{"name":"other"}', id).then(function () {
      vehicleService.vehicle["other"] = null;
      init();
      messageService.showMessage({
        'type': 'success',
        'title': 'Vehicle',
        'text': 'Vehicle ' + vehName + ' Deleted successfully.'
      });
    }, function () {
      messageService.showMessage({
        'type': 'error',
        'title': 'Vehicle',
        'text': 'vehicle ' + vehName + ' can not be deleted at this time. Please try again.'
      });
    });
  }
}]);