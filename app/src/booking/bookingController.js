app.controller('bookingController',
  ['$scope', '$state', '$rootScope', 'bookingService', 'messageService', 'config', '$uibModal',
    function ($scope, $state, $rootScope, bookingService, messageService, config, $uibModal) {
      $scope.data = [];
      $scope.loading = true;
      $scope.localEnv = config.local;
      var init = function () {
          bookingService.getBooking().then(success, function () {
            $state.go('login');
          });
        },
        bookingModal = function (type, data) {
          $uibModal.open({
            templateUrl: 'booking/booking-modal.html',
            controller: 'bookingModalController',
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
        success = function (res) {
          $scope.data = res.data;
          if (!bookingService.booking) {
            bookingService.booking = res.data;
          }
          $scope.loading = false;
        };
      $rootScope.$on('booking', function () {
        init();
      });
      init();
      $scope.addBooking = function () {
        bookingModal('new', {
          AC: 'Yes'
        });
      };
      $scope.viewRequest = function (id) {
        bookingModal('view', bookingService.filterRecord(id)[0]);
      };
      $scope.editRequest = function (id) {
        bookingModal('edit', bookingService.filterRecord(id)[0]);
      };
      $scope.deleteRequest = function (id) {
        messageService.deleteConfirm().result.then(function (data) {
          if (data) {
            $scope.deleteRecord(id);
          }
        });
      };
      $scope.deleteRecord = function (id) {
        var bookingName = bookingService.filterRecord(id)[0].name;
        bookingService.deleteBooking(id).then(function (res) {
          bookingService.booking = null;
          init();
          messageService.showMessage({
            'type': 'success',
            'title': 'Advanced Booking',
            'text': 'Booking ' + bookingName + ' Deleted successfully.'
          });
        }, function () {
          messageService.showMessage({
            'type': 'error',
            'title': 'Advanced Booking',
            'text': 'Booking ' + bookingName + ' can not be deleted at this time. Please try again.'
          });
        });
      }
    }]);