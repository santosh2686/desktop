var app = angular.module('travelApp', ['ui.router', 'templates', 'ui.bootstrap']);
app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      views: {
        'header': {
          templateUrl: 'header/auth-header.html'
        },
        'page': {
          templateUrl: 'login/login.html',
          controller: 'loginController'
        }
      }
    })
    .state('register', {
      url: '/register',
      views: {
        'header': {
          templateUrl: 'header/auth-header.html'
        },
        'page': {
          templateUrl: 'register/register.html',
          controller: 'registerController'
        }
      }
    })
    .state('forgot', {
      url: '/forgot',
      views: {
        'header': {
          templateUrl: 'header/auth-header.html'
        },
        'page': {
          templateUrl: 'forgotPassword/forgotpassword.html',
          controller: 'forgotPasswordController'
        }
      }
    })
    .state('dashboard', {
      url: '/dashboard',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'dashboard/dashboard.html',
          controller: 'dashboardController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('request', {
      url: '/request',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'request/request.html',
          controller: 'requestController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('request.regular', {
      url: '/regular',
      templateUrl: 'request/regular/regular-request.html',
      controller: 'regularListController'
    })
    .state('request.fixed', {
      url: '/fixed',
      templateUrl: 'request/fixed/fixed-request.html',
      controller: 'fixedListController'
    })
    .state('request.all', {
      url: '/all',
      templateUrl: 'request/all/all-request.html',
      controller: 'allListController'
    })
    .state('package', {
      url: '/package',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'package/package.html',
          controller: 'packageController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('package.local', {
      url: '/local',
      templateUrl: 'package/local/local-package.html',
      controller: 'localPackageController'
    })
    .state('package.out', {
      url: '/out',
      templateUrl: 'package/out/out-package.html',
      controller: 'outPackageController'
    })
    .state('package.fix', {
      url: '/fix',
      templateUrl: 'package/fix/fix-package.html',
      controller: 'fixPackageController'
    })
    .state('vehicle', {
      url: '/vehicle',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'vehicle/vehicle.html',
          controller: 'vehicleController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('vehicle.own', {
      url: '/own',
      templateUrl: 'vehicle/own/own-vehicle.html',
      controller: 'ownVehicleController'
    })
    .state('vehicle.other', {
      url: '/other',
      templateUrl: 'vehicle/other/other-vehicle.html',
      controller: 'otherVehicleController'
    })
    .state('driver', {
      url: '/driver',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'driver/driver.html',
          controller: 'driverController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }

    })
    .state('party', {
      url: '/party',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'party/party.html',
          controller: 'partyController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('party.client', {
      url: '/client',
      templateUrl: 'party/client/client.html',
      controller: 'clientController'
    })
    .state('party.operator', {
      url: '/operator',
      templateUrl: 'party/operator/operator.html',
      controller: 'operatorController'
    })
    .state('expense', {
      url: '/expense',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'expense/expense.html',
          controller: 'expenseController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('expense.vehicle', {
      url: '/vehicle',
      templateUrl: 'expense/vehicle/vehicle-expense.html',
      controller: 'vehicleExpenseController'
    })
    .state('expense.driver', {
      url: '/driver',
      templateUrl: 'expense/driver/driver-expense.html',
      controller: 'driverExpenseController'
    })
    .state('payment', {
      url: '/payment',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'payment/payment.html',
          controller: 'paymentController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('payment.fixed', {
      url: '/fixed',
      templateUrl: 'payment/fixed/fixed-payment.html',
      controller: 'fixedPaymentController'
    })
    .state('payment.client', {
      url: '/client',
      templateUrl: 'payment/client/client-payment.html',
      controller: 'clientPaymentController'
    })
    .state('payment.operator', {
      url: '/operator',
      templateUrl: 'payment/operator/operator-payment.html',
      controller: 'operatorPaymentController'
    })
    .state('payment.indirect', {
      url: '/indirect',
      templateUrl: 'payment/indirect/indirect-payment.html',
      controller: 'indirectPaymentController'
    })
    .state('payment.driver', {
      url: '/driver',
      templateUrl: 'payment/driver/driver-payment.html',
      controller: 'driverPaymentController'
    })
    .state('summary', {
      url: '/summary',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'summary/summary.html',
          controller: 'summaryController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
    .state('summary.vehicle', {
      url: '/vehicle',
      templateUrl: 'summary/vehicle/vehicle-summary.html',
      controller: 'vehicleSummaryController'
    })
    .state('summary.driver', {
      url: '/driver',
      templateUrl: 'summary/driver/driver-summary.html',
      controller: 'driverSummaryController'
    })
    .state('booking', {
      url: '/booking',
      views: {
        'header': {
          templateUrl: 'header/home-header.html',
          controller: 'headerController'
        },
        'page': {
          templateUrl: 'booking/booking.html',
          controller: 'bookingController'
        },
        'footer': {
          templateUrl: 'footer/footer.html'
        }
      }
    })
}]);
