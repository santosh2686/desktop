app.factory('expenseService', ['$uibModal', '$filter', '$q', 'config', function ($uibModal, $filter, $q, config) {
  return {
    expense: {
      'vehicleExpense': null,
      'driverExpense': null,
    },
    filterRecord: function (type, id) {
      return $filter('filter')(this.expense[type], {'_id': config.local ? id : {'$oid': id}});
    },
    getExpense: function (type, query) {
      return this.expense[type] ? $q.resolve({data: this.expense[type]}) : config.getData(config[type], query);
    },
    addExpense: function (type, data) {
      return config.postData(config[type], data);
    },
    updateExpense: function (type, id, data) {
      var filter = config.local ? '{"_id":"' + id + '"}' : '{"_id":{"$oid":"' + id.$oid + '"}}';
      return config.updateData(config[type], filter, {$set: data});
    },
    deleteExpense: function (type, id) {
      return config.deleteData(config[type], id);
    }
  }
}]);