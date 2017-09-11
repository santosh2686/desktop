app.controller('localPackageController', ['$scope', '$state', '$rootScope', '$uibModal', 'packageService', 'messageService', 'gridMap',
  function ($scope, $state, $rootScope, $uibModal, packageService, messageService, gridMap) {
    $scope.data = [];
    $scope.gridConfig = gridMap.PACKAGE;
    $scope.loading = true;
    var success = function (res) {
        $scope.data = res.data[0].data;
        if (!packageService.package.local) {
          packageService.package.local = res.data;
        }
        $scope.loading = false;
      },
      init = function () {
        packageService.getPackage('local').then(success, function () {
          $state.go('login');
        });
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
                'type': 'local',
                'data': data
              };
            }
          }
        });
      };
    $rootScope.$on('localPackage', function () {
      init();
    });
    init();
    $scope.newPackage = function () {
      packageModal('new', {});
    };
    $scope.view = function (id) {
      packageModal('view', packageService.filterRecord('local', id)[0]);
    };
    $scope.edit = function (id) {
      packageModal('edit', packageService.filterRecord('local', id)[0]);
    };
    $scope.delete = function (id) {
      messageService.deleteConfirm().result.then(function (data) {
        if (data) {
          $scope.deleteRecord(id);
        }
      });
    };
    $scope.deleteRecord = function (id) {
      var pkgName = packageService.filterRecord('local', id)[0].packageCode;
      packageService.deletePackage('{"name":"local"}', id).then(function () {
        packageService.package["local"] = null;
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