var mainApp = angular.module('mainApp', ['ngMaterial', 'ngRoute']);

// STATIC VARIABLES
mainApp.value('url_menu', 'template/menu');
mainApp.value('url_info', 'template/info');

// CONFIGURATION APP
mainApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider
                .when('/:template/:ci_dir/:ci_class', {
                    templateUrl: function (urlattr) {
                        return 'template/show/' + urlattr.template + '.html';
                    }
                })
                .otherwise({
                    redirectTo: '/template-home/user/home'
                });
    }
]);

// SERVICES APP
mainApp.service('menuService', function ($http, generalService, url_menu, $rootScope) {
    this.request = function () {
        $http.get(url_menu).then(callbackMenu, generalService.errorCallback);
        function callbackMenu(response) {
            $rootScope.name_app = response.data.name_app;
            $rootScope.menus = response.data.menu;
        }
    }
});
mainApp.service('generalService', function ($location) {
    this.errorCallback = function (error) {
        if (error.status == 403) {
            $location.path("/user-login/login");
        }

        swal({
            title: 'Error Ajax Response (XHR Failed)',
            text: 'Status: ' + error.status + ' - ' + error.statusText + ' <hr>Message:<br>' + error.data,
            type: 'error',
            html: true,
        });
    };
});

// CONTROLLERS APP
mainApp.controller('DemoBasicCtrl', function () {});

mainApp.controller('headerController', function ($scope, $rootScope, menuService, $timeout) {
    menuService.request($scope);
    $scope = $rootScope;
    $scope.menuOpened = false;
    $scope.collapseMenu = function () {
        $scope.menuOpened = !$scope.menuOpened;
    };
});
