app.controller('operatorController', ['$scope', '$rootScope', '$uibModal', 'partyService', 'messageService', 'gridMap', function ($scope, $rootScope, $uibModal, partyService, messageService, gridMap) {
  $scope.data = [];
  $scope.gridConfig = gridMap.PARTY.OPERATOR;
  $scope.loading = true;
  var success = function (res) {
      $scope.data = res.data[0].data;
      if (!partyService.party.operator) {
        partyService.party.operator = res.data;
      }
      $scope.loading = false;
    },
    init = function () {
      partyService.getParty('operator').then(success);
    },
    partyModal = function (action, data) {
      $uibModal.open({
        templateUrl: 'party/party-modal.html',
        controller: 'partyModalController',
        size: 'lg',
        resolve: {
          record: function () {
            return {
              'action': action,
              'type': 'operator',
              'data': data
            };
          }
        }
      });
    };
  $rootScope.$on('operatorParty', function () {
    init();
  });
  init();
  $scope.newOperator = function () {
    partyModal('new', {});
  };
  $scope.view = function (id) {
    partyModal('view', partyService.filterRecord('operator', id)[0]);
  };
  $scope.edit = function (id) {
    partyModal('edit', partyService.filterRecord('operator', id)[0]);
  };
  $scope.delete = function (id) {
    messageService.deleteConfirm().result.then(function (data) {
      if (data) {
        $scope.deleteRecord(id);
      }
    });
  };
  $scope.deleteRecord = function (id) {
    var partyName = partyService.filterRecord('operator', id)[0].name;
    partyService.deleteParty('{"name":"operator"}', id).then(function () {
      partyService.party["operator"] = null;
      init();
      messageService.showMessage({
        'type': 'success',
        'title': 'Operator',
        'text': 'Operator ' + partyName + ' deleted successfully.'
      });
    }, function () {
      messageService.showMessage({
        'type': 'error',
        'title': 'Operator',
        'text': 'Operator ' + partyName + ' can not be deleted at this time. Please try again.'
      });
    });
  }
}]);