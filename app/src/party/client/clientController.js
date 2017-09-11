app.controller('clientController', ['$scope', '$state', '$rootScope', '$uibModal', 'partyService', 'messageService', 'gridMap',
  function ($scope, $state, $rootScope, $uibModal, partyService, messageService, gridMap) {
    $scope.data = [];
    $scope.gridConfig = gridMap.PARTY.CLIENT;
    $scope.loading = true;
    var success = function (res) {
        $scope.data = res.data[0].data;
        if (!partyService.party.client) {
          partyService.party.client = res.data;
        }
        $scope.loading = false;
      },
      init = function () {
        partyService.getParty('client').then(success, function () {
          $state.go('login');
        });
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
                'type': 'client',
                'data': data
              };
            }
          }
        });
      };
    $rootScope.$on('clientParty', function () {
      init();
    });
    init();
    $scope.newParty = function () {
      partyModal('new', {});
    };
    $scope.view = function (id) {
      partyModal('view', partyService.filterRecord('client', id)[0]);
    };
    $scope.edit = function (id) {
      partyModal('edit', partyService.filterRecord('client', id)[0]);
    };
    $scope.delete = function (id) {
      messageService.deleteConfirm().result.then(function (data) {
        if (data) {
          $scope.deleteRecord(id);
        }
      });
    };
    $scope.deleteRecord = function (id) {
      var partyName = partyService.filterRecord('client', id)[0].name;
      partyService.deleteParty('{"name":"client"}', id).then(function () {
        partyService.party["client"] = null;
        init();
        messageService.showMessage({
          'type': 'success',
          'title': 'Party',
          'text': 'Party ' + partyName + ' deleted successfully.'
        });
      }, function () {
        messageService.showMessage({
          'type': 'error',
          'title': 'Party',
          'text': 'Party ' + partyName + ' can not be deleted at this time. Please try again.'
        });
      });
    }
  }]);
