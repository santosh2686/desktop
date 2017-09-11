app.controller('driverSummaryController',
  ['$scope', '$state', '$filter', '$q', 'config', 'driverService', 'requestService', 'expenseService',
    function ($scope, $state, $filter, $q, config, driverService, requestService, expenseService) {

      $scope.yearList = config.years();
      if (sessionStorage.getItem('year')) {
        $scope.year = sessionStorage.getItem('year');
      } else {
        $scope.year = new Date().getFullYear().toString();
      }
      var monthSet = config.months, chartData = {local: [], out: []}, localChart, outChart,
        init = function () {
          $scope.loading = true;
          driverService.getDriver().then(function (res) {
            $scope.driverList = res.data;
            if (sessionStorage.getItem('driver')) {
              $scope.driverSelect = sessionStorage.getItem('driver');
            } else {
              $scope.driverSelect = $scope.driverList[0].name;
            }
            loadSummary();
            if (!driverService.driver) {
              driverService.driver = res.data;
            }
          });
        },
        loadSummary = function () {
          requestService.request.regular = null;
          requestService.request.fixed = null;
          $q.all([requestService.getRequest('regular', 'q={"year":"' + $scope.year + '", "vehicleSelect":"own","vehicle.driver":"' + $scope.driverSelect + '"}&f={"requestType":1,"profit":1,"month":1}'), requestService.getRequest("fixed", 'q={"$or":[{"regularVehicle":"own","vehicleSelect":"daily"},{"regularVehicle":"own","vehicleSelect":"own"},{"regularVehicle":"indirect","vehicleSelect":"own"}],"driver":"' + $scope.driverSelect + '","year":"' + $scope.year + '"}')]).then(function (res) {
            for (var i = 0; i < monthSet.length; i++) {
              chartData.local.push($filter('filter')(res[0].data, {
                  'month': monthSet[i],
                  'requestType': 'local'
                }).length + $filter('filter')(res[1].data, {'month': monthSet[i], 'requestType': 'local'}).length);
              chartData.out.push($filter('filter')(res[0].data, {
                  'month': monthSet[i],
                  'requestType': 'out'
                }).length + $filter('filter')(res[1].data, {'month': monthSet[i], 'requestType': 'out'}).length);
            }
            updateSummary();
          });
        },
        updateSummary = function () {
          $scope.loading = false;
          angular.forEach(chartData, function (item, key) {
            new Chart(document.getElementById(key), {
              type: 'bar',
              data: {
                labels: config.months,
                datasets: [{
                  label: key.toUpperCase() + ' ',
                  backgroundColor: "rgba(54,162,235,0.2)",
                  borderColor: "rgba(54,162,235,1)",
                  borderWidth: 0.5,
                  hoverBackgroundColor: "rgba(54,162,235,0.4)",
                  hoverBorderColor: "rgba(54,162,235,1)",
                  data: item
                }]
              }
            });
          });
          sessionStorage.removeItem('driver');
          sessionStorage.removeItem('year');
        };
      init();
      $scope.redrawGraph = function () {
        sessionStorage.setItem('driver', $scope.driverSelect);
        sessionStorage.setItem('year', $scope.year);
        $state.reload();
      }
    }]);
