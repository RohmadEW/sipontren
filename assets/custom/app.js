
(function () {
    "use strict";

    angular.module('mainApp', ['ngMaterial', 'ngRoute', 'ngTable']);

    angular.module('mainApp').run(function ($rootScope) {
        $rootScope.$on('loading:progress', function () {
            $rootScope.ajaxRunning = true;
        });

        $rootScope.$on('loading:finish', function () {
            $rootScope.ajaxRunning = false;
        });
    });

// STATIC VARIABLES
    angular.module('mainApp').value('url_menu', 'template/menu');
    angular.module('mainApp').value('url_info', 'template/info');

// CONFIGURATION 
    angular.module('mainApp').config(
            function ($routeProvider, $locationProvider, $httpProvider) {
                $locationProvider.hashPrefix('');
                $routeProvider
                        .when('/:template/:ci_dir/:ci_class', {
                            templateUrl: function (urlattr) {
                                return 'template/show/' + urlattr.template + '.html';
                            }
                        })
                        .otherwise({
                            redirectTo: '/template-content/user/home'
                        });
                $httpProvider.interceptors.push('httpInterceptor');
            }
    );

// FACTORY
    angular.module('mainApp').factory('httpInterceptor', function ($q, $rootScope) {
        var loadingCount = 0;

        return {
            request: function (config) {
                if (++loadingCount === 1)
                    $rootScope.$broadcast('loading:progress');
                return config || $q.when(config);
            },

            response: function (response) {
                if (--loadingCount === 0)
                    $rootScope.$broadcast('loading:finish');
                return response || $q.when(response);
            },

            responseError: function (response) {
                if (--loadingCount === 0)
                    $rootScope.$broadcast('loading:finish');
                return $q.reject(response);
            }
        };
    }
    );

// SERVICES APP
    angular.module('mainApp').service('generalService', function ($location, $route, $templateCache) {
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
})();

// CONTROLLERS APP

(function () {
    "use strict";
    
    angular.module('mainApp').controller('DemoBasicCtrl', function () {});

    angular.module('mainApp').controller('agamaController', function ($scope, $routeParams, $http, generalService, NgTableParams) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.get_data = get_data();
        $scope.appReady = false;

        var data = [{name: "Moroni", age: 50} /*,*/];
        $scope.dataTables = new NgTableParams({}, {dataset: data});

        $http.get($scope.mainURI + '/index').then(callbackSuccess, generalService.errorCallback);

        function callbackSuccess(response) {
            $scope.title = response.data.title;
            $scope.breadcrumb = response.data.breadcrumb;

            get_data();

            $scope.appReady = true;
        }

        function get_data() {
            $http.get($scope.mainURI + '/datatable').then(callbackDatatables, generalService.errorCallback);
        }

        function callbackDatatables(response) {
        }
    });

    angular.module('mainApp').controller('headerController', function ($scope, $http, url_menu, generalService, $location) {
        $http.get(url_menu).then(callbackMenu, generalService.errorCallback);

        function callbackMenu(response) {
            $scope.name_app = response.data.name_app;
            $scope.menus = response.data.menus;
        }

        $scope.go = function (menus) {
            $location.path(menus.link);
        }
    });

})();