
(function () {
    "use strict";

    angular.module('mainApp', ['ngMaterial', 'ngRoute', 'ngTable', 'ngMessages']);

    angular.module('mainApp').run(function ($rootScope) {
        $rootScope.$on('loading:progress', function () {
            $rootScope.ajaxRunning = true;
        });

        $rootScope.$on('loading:finish', function () {
            $rootScope.ajaxRunning = false;
        });

        $rootScope.showMenu = true;
    });

// STATIC VARIABLES
    angular.module('mainApp').value('url_menu', 'template/menu');
    angular.module('mainApp').value('url_info', 'template/info');
    angular.module('mainApp').value('url_template', 'template/show/');
    angular.module('mainApp').value('url_home', '/master_data-kecamatan/datatable/master_data/kecamatan');
    angular.module('mainApp').value('url_login', '/user/login/user/login');

// CONFIGURATION 
    angular.module('mainApp').config(
            function ($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider) {
                $locationProvider.hashPrefix('');
                $routeProvider
                        .when('/:template/:index/:ci_dir/:ci_class', {
                            templateUrl: function (urlattr) {
                                return 'template/show/' + urlattr.template + '-' + urlattr.index + '.html';
                            }
                        })
                        .otherwise({
                            redirectTo: '/template-content/index/user/home'
                        });
                $httpProvider.interceptors.push('httpInterceptor');
                $mdThemingProvider.theme('default')
                        .primaryPalette('green')
                        .accentPalette('lime');
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
    angular.module('mainApp').service('notificationService', function ($location, $mdDialog, $mdToast, url_login) {
        this.errorCallback = function (error) {
            if (error.status === 403) {
                $location.path(url_login);
            }

            $mdDialog.show(
                    $mdDialog.alert()
                    .clickOutsideToClose(true)
                    .title('Error Ajax Response (XHR Failed)')
                    .textContent('Status: ' + error.status + ' - ' + error.statusText + ' \n Message:<br>' + error.data)
                    .ariaLabel('Error')
                    .ok('OK')
                    );
        };
        this.toastSimple = function (text) {
            $mdToast.show($mdToast.simple().textContent(text).position('top right').hideDelay(3000));
        };
    });

    angular.module('mainApp').service("dataScopeShared", function () {
        var dataList = {};

        var addData = function (key, value) {
            dataList[key] = value;
        };

        var getData = function (key) {
            return dataList[key];
        };

        return {
            addData: addData,
            getData: getData
        };
    });

    angular.module('mainApp').service("formHelper", function ($timeout, $q) {
        this.autocomplete = function (scope) {
            scope.noCache = false;
            scope.selectedItem = null;
            scope.searchText = null;
            scope.dataAll = loadAll();

            scope.querySearch = function (query) {
                var results = query ? scope.dataAll.filter(createFilterFor(query)) : scope.dataAll;
                var deferred = $q.defer();

                $timeout(function () {
                    deferred.resolve(results);
                }, Math.random() * 1000, false);

                return deferred.promise;
            };

            function loadAll() {
                var data = scope.dataAutocomplete;

                return data.map(function (detail) {
                    return {
                        key: detail.id,
                        value: detail.label.toLowerCase(),
                        display: detail.label
                    };
                });
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(detail) {
                    return (detail.value.indexOf(lowercaseQuery) === 0);
                };
            }

            scope.$watch('selectedItem', function (selectedItem) {
                console.log(selectedItem);
            });

            return scope;
        };
    });

})();

// CONTROLLERS APP

(function () {
    "use strict";

    angular.module('mainApp').controller('headerController', function ($rootScope, $scope, $http, url_menu, url_login, notificationService, $location, url_template, $mdBottomSheet) {
        $http.get(url_menu).then(callbackMenu, notificationService.errorCallback);

        function callbackMenu(response) {
            $scope.name_app = response.data.name_app;
            $scope.menus = response.data.menus;
        }

        $scope.go = function (menus) {
            $location.path(menus.link);
        }

        $scope.showInfoDev = function () {
            $mdBottomSheet.show({
                templateUrl: url_template + 'template-info_dev.html',
            });
        };

        $scope.logOut = function () {
            $rootScope.showMenu = false;

            $location.path(url_login);
        };
    });

    angular.module('mainApp').controller('loginController', function ($rootScope, $scope, $http, notificationService, $routeParams, url_home, $location) {
        $rootScope.showMenu = false;

        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.form = {
            'username': '',
            'password': ''
        };

        $http.get($scope.mainURI + '/logout');
        $scope.loginApp = function () {
            $http.post($scope.mainURI + '/proccess', $scope.formData).then(successCallback, notificationService.errorCallback);
        };

        function successCallback(response) {
            notificationService.toastSimple(response.data.notification.text);

            if (response.data.status) {
                $rootScope.showMenu = true;

                $location.path(url_home);
            }
        }
    });

    angular.module('mainApp').controller('DemoBasicCtrl', function () {});

    angular.module('mainApp').controller('datatableController', function ($scope, $routeParams, $http, notificationService, NgTableParams, $mdDialog, url_template, $timeout, $mdSidenav, $route, $templateCache) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.mainTemplate = url_template + $routeParams.template;
        $scope.getData = getData();
        $scope.appReady = false;

        $scope.fabHidden = true;
        $scope.fabIsOpen = false;
        $scope.fabHover = false;

        $http.get($scope.mainURI + '/index').then(callbackSuccess, notificationService.errorCallback);

        function callbackSuccess(response) {
            $scope.title = response.data.title;
            $scope.breadcrumb = response.data.breadcrumb;
            $scope.table = response.data.table;

            getData();

            $scope.appReady = true;
        }

        function getData() {
            $http.get($scope.mainURI + '/datatable').then(callbackDatatables, notificationService.errorCallback);
        }

        function callbackDatatables(response) {
            var initialParams = {
                count: 15
            };
            var initialSettings = {
                counts: [],
                dataset: response.data.data
            };

            $scope.dataTables = new NgTableParams(initialParams, initialSettings);
            $scope.fabHidden = false;
        }

        $scope.$watch('demo.isOpen', function (isOpen) {
            if (isOpen) {
                $timeout(function () {
                    $scope.tooltipVisible = $scope.isOpen;
                }, 600);
            } else {
                $scope.tooltipVisible = $scope.isOpen;
            }
        });

        $scope.menuItems = [
            {id: "add_data", name: "Tambah Data", icon: "add"},
            {id: "download_data", name: "Unduh Data", icon: "file_download"},
            {id: "print_data", name: "Catak Data", icon: "print"},
            {id: "reload_data", name: "Muat Ulang Data", icon: "refresh"},
            {id: "reload_page", name: "Muat Ulang Halaman", icon: "autorenew"},
            {id: "request_doc", name: "Dokumentasi", icon: "help"},
        ];

        $scope.openDialog = function ($event, item) {
            if (item.id === 'reload_data') {
                $scope.fabHidden = true;
                getData();
            } else if (item.id === 'reload_page') {
                reloadPage();
            } else if (item.id === 'request_doc') {
                $mdSidenav('right').toggle();
            } else if (item.id === 'add_data') {
                $mdDialog
                        .show({
                            clickOutsideToClose: true,
                            templateUrl: $scope.mainTemplate + '-add.html',
                            targetEvent: $event
                        })
                        .then(
                                function (text) {
                                    notificationService.toastSimple(text);
                                    getData();
                                },
                                function () {
                                    // CANCEL DIALOG
                                }
                        );
            }
        };

        function reloadPage() {
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            $route.reload();
        }
    });

    angular.module('mainApp').controller('kecamatanController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.cancelSumbit = function () {
            $mdDialog.cancel();
        };
        $scope.saveSubmit = function () {
            if ($scope.form.ID_KAB.$valid && $scope.form.NAMA_KEC.$valid) {
                $scope.ajaxRunning = true;
                
                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };
        $scope.formData = {
            KABUPATEN_KEC: null,
            NAMA_KEC: null
        };
        $scope.$watch('ID_KAB.selectedItem', function (selectedItem){
            $scope.formData.KABUPATEN_KEC = selectedItem.key;
        });

        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            $http.get(response.data.uri.kabupaten).then(callbackKabupaten, notificationService.errorCallback);
        }

        function callbackKabupaten(response) {
            $scope.dataAutocomplete = response.data;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;

            $scope.ID_KAB = formHelper.autocomplete($scope);
        }
        
        function callbackSuccessSaving (response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
        }
    });

    angular.module('mainApp').controller('docDatatableController', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.title = 'Dokumentasi';
        $scope.content = 'Isi Dokumentasi';
    });

})();