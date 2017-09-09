app.factory('requestService', ['$uibModal', '$filter', '$q', 'config', function ($uibModal, $filter, $q, config) {
  return {
    request: {
      'regular': null,
      'fixed': null,
      'pager': {
        'currentPage': 1,
        'itemsPerPage': 15,
        'maxSize': 5
      }
    },
    filterRequest: function (type, id) {
      return $filter('filter')(this.request[type], {'_id': config.local ? id : {'$oid': id}});
    },
    getRequest: function (type, query) {
      return (this.request[type]) ? $q.resolve({data: this.request[type]}) : config.getData(config[type], query);
    },
    addRequest: function (type, data) {
      return config.postData(config[type], data);
    },
    updateRequest: function (type, id, data) {
      var filter = config.local ? '{"_id":"' + id + '"}' : '{"_id":{"$oid":"' + id.$oid + '"}}';
      return config.updateData(config[type], filter, {$set: data});
    },
    deleteRequest: function (type, id) {
      return config.deleteData(config[type], id);
    },
    newRequest: function (type, template, controller) {
      var modalInstance = $uibModal.open({
        templateUrl: template,
        controller: controller,
        size: 'lg',
        resolve: {
          record: function () {
            return {
              'type': type,
              'action': 'new'
            };
          }
        }
      });
    },
    editRequest: function (type, template, controller, id) {
      var self = this;
      var modalInstance = $uibModal.open({
        templateUrl: template,
        controller: controller,
        size: 'lg',
        resolve: {
          record: function () {
            return {
              'type': type,
              'action': 'edit',
              'data': self.filterRequest(type, id)
            }
          }
        }
      });
    },
    viewRequest: function (type, template, controller, id) {
      var self = this;
      var modalInstance = $uibModal.open({
        templateUrl: template,
        controller: controller,
        size: 'lg',
        resolve: {
          record: function () {
            return {
              'type': type,
              'action': 'view',
              'data': self.filterRequest(type, id)
            }
          }
        }
      });

    }
  };
}]);
