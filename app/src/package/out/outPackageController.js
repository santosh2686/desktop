app.controller('outPackageController', ['$scope', '$rootScope', '$uibModal', 'packageService', 'messageService', 'gridMap', function ($scope, $rootScope, $uibModal, packageService, messageService, gridMap) {
  $scope.data = [];
  $scope.gridConfig = gridMap.PACKAGE;
  $scope.loading = true;
  var success = function (res) {
      $scope.data = res.data[0].data;
      if (!packageService.package.out) {
        packageService.package.out = res.data;
      }
      $scope.loading = false;
    },
    init = function () {
      packageService.getPackage('out').then(success);
    },
    packageModal = function (action, data) {
      $uibModal.open({
        templateUrl: 'package/package-modal.html',
        controller: 'packageModalController',
        size: 'lg',
        resolve: {
          record: function () {
            return {
              'action': action,
              'type': 'out',
              'data': data
            };
          }
        }
      });
    };
  $rootScope.$on('outPackage', function () {
    init();
  });
  init();
  $scope.newPackage = function () {
    packageModal('new', {});
  };
  $scope.view = function (id) {
    packageModal('view', packageService.filterRecord('out', id)[0]);
  };
  $scope.edit = function (id) {
    packageModal('edit', packageService.filterRecord('out', id)[0]);
  };
  $scope.delete = function (id) {
    messageService.deleteConfirm().result.then(function (data) {
      if (data) {
        $scope.deleteRecord(id);
      }
    });
  };
  $scope.deleteRecord = function (id) {
    var pkgName = packageService.filterRecord('out', id)[0].packageCode;
    packageService.deletePackage('{"name":"out"}', id).then(function () {
      packageService.package["out"] = null;
      init();
      messageService.showMessage({
        'type': 'success',
        'title': 'Package',
        'text': 'Package ' + pkgName + ' Deleted successfully.'
      });
    }, function () {
      messageService.showMessage({
        'type': 'error',
        'title': 'Package',
        'text': 'Package ' + pkgName + ' can not be deleted at this time. Please try again.'
      });
    });
  }
}]);
