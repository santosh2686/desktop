app.factory('bookingService', ['$filter', '$q', 'config', function ($filter, $q, config) {
  return {
    booking: null,
    filterRecord: function (id) {
      return $filter('filter')(this.booking, {'_id': config.local ? id : {'$oid': id}});
    },
    getBooking: function () {
      if (this.booking) {
        return $q.resolve({data: this.booking});
      } else {
        return config.getData(config.booking, 'q={}');
      }
    },
    addBooking: function (booking) {
      return config.postData(config.booking, booking);
    },
    updateBooking: function (id, data) {
      var filter = config.local ? '{"_id":"' + id + '"}' : '{"_id":{"$oid":"' + id.$oid + '"}}';
      return config.updateData(config.booking, filter, {$set: data});
    },
    deleteBooking: function (id) {
      return config.deleteData(config.booking, id);
    }
  }
}]);