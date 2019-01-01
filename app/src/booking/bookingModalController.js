app.controller('bookingModalController',
  ['$scope', '$rootScope', '$uibModalInstance', 'bookingService', 'messageService', 'record',
    function ($scope, $rootScope, $uibModalInstance, bookingService, messageService, record) {
      'use strict';
      $scope.booking = angular.copy(record.data);
      $scope.action = record.action;
      if (record.action === 'edit') {
        $scope.booking.pickUpDate = new Date($scope.booking.pickUpDate);
        $scope.booking.pickUpTime = new Date($scope.booking.pickUpTime);
      }

      if ($scope.action === 'edit') {
        var recordId = $scope.booking._id;
      }
      $scope.calendar = {
        open: false
      };
      $scope.loading = false;
      $scope.hideView = ($scope.action === 'view');
      $scope.openCalendar = function () {
        $scope.calendar.open = true;
      };
      $scope.closeModal = function () {
        $uibModalInstance.close();
      };
      $scope.submitRequest = function () {
        $scope.loading = true;
        if (record.action === 'new') {
          bookingService.addBooking($scope.booking).then(function () {
            $scope.closeModal();
            bookingService.booking = null;
            $rootScope.$emit('booking');
            messageService.showMessage({
              'type': 'success',
              'title': 'Booking',
              'text': 'New Booking added successfully.'
            });
          }, function () {
            messageService.showMessage({
              'type': 'error',
              'title': 'Booking',
              'text': 'Booking not added successfully. Please try again.'
            });
          });
        } else {
          delete $scope.booking._id;
          bookingService.updateBooking(recordId, $scope.booking).then(function () {
            $scope.closeModal();
            bookingService.booking = null;
            $rootScope.$emit('booking');
            messageService.showMessage({
              'type': 'success',
              'title': 'Booking',
              'text': 'Booking updated successfully.'
            });
          }, function (err) {
            messageService.showMessage({
              'type': 'error',
              'title': 'Booking',
              'text': 'Booking not updated successfully. Please try again.'
            });
          });
        }
      };
}]);
