(function () {
    "use strict";

    angular.module('mainApp', ['ngMaterial', 'ngRoute', 'ngTable', 'ngMessages', 'ngLocale', 'ngSanitize']);

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
            function ($routeProvider, $locationProvider, $httpProvider, $mdThemingProvider, $mdDateLocaleProvider) {
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
                $mdDateLocaleProvider.formatDate = function (date) {
                    return moment(date).format('DD-MM-YYYY');
                };
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
                    .title('Error Response: ' + error.status + ' - ' + error.statusText)
                    .htmlContent(error.data)
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
                        value: detail.title.toLowerCase(),
                        display: detail.title
                    };
                });
            }

            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);

                return function filterFn(detail) {
                    return (detail.value.indexOf(lowercaseQuery) === 0);
                };
            }

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

    angular.module('mainApp').controller('datatableController', function ($scope, $routeParams, $http, notificationService, NgTableParams, $mdDialog, url_template, $timeout, $mdSidenav, $route, $templateCache, dataScopeShared) {
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
                createDialog($event, 'form');
            }
        };

        function reloadPage() {
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            $route.reload();
        }

        function createDialog(event, mode) {
            $mdDialog
                    .show({
                        clickOutsideToClose: false,
                        templateUrl: $scope.mainTemplate + '-' + mode + '.html',
                        targetEvent: event
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

        $scope.actionRow = function ($event, action, data) {
            if (action.update)
                updateRow($event, data);
            else if (action.delete)
                deleteRow($event, data);
        };

        function updateRow(event, data) {
            dataScopeShared.addData('DATA_UPDATE', data);
            createDialog(event, 'form');
        }

        function deleteRow(event, data) {
            var confirm = $mdDialog.confirm()
                    .title('Apakah Anda yakin melanjutkan?')
                    .textContent('Data yang telah dihapus tidak dapat dikembalikan.')
                    .ariaLabel('Hapus data')
                    .targetEvent(event)
                    .ok('Ya')
                    .cancel('Tidak');

            $mdDialog.show(confirm).then(function () {
                $http.post($scope.mainURI + '/delete', data).then(callbackSuccessDelete, notificationService.errorCallback);
            }, function () {
                // cancel
            });
        }

        function callbackSuccessDelete(response) {
            notificationService.toastSimple(response.data.notification.text);
            getData();
        }
    });

    angular.module('mainApp').controller('kecamatanController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_KEC: null,
            KABUPATEN_KEC: null,
            NAMA_KEC: null
        };

        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            $http.get(response.data.uri.kabupaten).then(callbackFormData, notificationService.errorCallback);
        }

        function callbackFormData(response) {
            $scope.dataAutocomplete = response.data;
            $scope.ID_KAB = formHelper.autocomplete($scope);

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            angular.forEach($scope.ID_KAB.dataAll, function (value, key) {
                if (parseInt(response.data.ID_KAB) === parseInt(value.key)) {
                    $scope.ID_KAB.selectedItem = value;
                }
            });

            $scope.formData.ID_KEC = response.data.ID_KEC;
            $scope.formData.NAMA_KEC = response.data.NAMA_KEC;
            $scope.formData.KABUPATEN_KEC = response.data.KABUPATEN_KEC;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
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

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }

        $scope.$watch('ID_KAB.selectedItem', function (selectedItem) {
            if (typeof selectedItem === 'undefined' || selectedItem.key === null)
                $scope.formData.KABUPATEN_KEC = null;
            else
                $scope.formData.KABUPATEN_KEC = selectedItem.key;
        });
    });

    angular.module('mainApp').controller('mdTAController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_TA: null,
            NAMA_TA: null,
            TANGGAL_MULAI_TA: null,
            TANGGAL_AKHIR_TA: null,
            AKTIF_TA: null,
            KETERANGAN_TA: null,
        };
        
        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            $scope.dataAKTIF_TA = response.data.dataAKTIF_TA;

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_TA = response.data.ID_TA;
            $scope.formData.NAMA_TA = response.data.NAMA_TA;
            $scope.formData.TANGGAL_MULAI_TA = response.data.TANGGAL_MULAI_TA;
            $scope.formData.TANGGAL_AKHIR_TA = response.data.TANGGAL_AKHIR_TA;
            $scope.formData.AKTIF_TA = response.data.AKTIF_TA;
            $scope.formData.KETERANGAN_TA = response.data.KETERANGAN_TA;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {3
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });

    angular.module('mainApp').controller('mdPAController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_CAWU: null,
            NAMA_CAWU: null,
            AKTIF_CAWU: null,
            KETERANGAN_CAWU: null,
        };
        
        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            $scope.dataAKTIF_CAWU = response.data.dataAKTIF_CAWU;

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_CAWU = response.data.ID_CAWU;
            $scope.formData.NAMA_CAWU = response.data.NAMA_CAWU;
            $scope.formData.AKTIF_CAWU = response.data.AKTIF_CAWU;
            $scope.formData.KETERANGAN_CAWU = response.data.KETERANGAN_CAWU;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {3
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });

    angular.module('mainApp').controller('akadKelasController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_KELAS: null,
            KEGIATAN_KELAS: null,
            NAMA_KELAS: null,
            KETERANGAN_KELAS: null,
            KODE_EMIS_KELAS: null,
        };

        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            $scope.dataKEGIATAN_KELAS = response.data.dataKEGIATAN_KELAS;

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_KELAS = response.data.ID_KELAS;
            $scope.formData.KEGIATAN_KELAS = response.data.KEGIATAN_KELAS;
            $scope.formData.NAMA_KELAS = response.data.NAMA_KELAS;
            $scope.formData.KETERANGAN_KELAS = response.data.KETERANGAN_KELAS;
            $scope.formData.KODE_EMIS_KELAS = response.data.KODE_EMIS_KELAS;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });

    angular.module('mainApp').controller('akadKegiatanController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_KEGIATAN: null,
            NAMA_KEGIATAN: null,
            KETERANGAN_KEGIATAN: null,
            KODE_EMIS_KEGIATAN: null,
        };
        
        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_KEGIATAN = response.data.ID_KEGIATAN;
            $scope.formData.NAMA_KEGIATAN = response.data.NAMA_KEGIATAN;
            $scope.formData.KETERANGAN_KEGIATAN = response.data.KETERANGAN_KEGIATAN;
            $scope.formData.KODE_EMIS_KEGIATAN = response.data.KODE_EMIS_KEGIATAN;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {3
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });

    angular.module('mainApp').controller('akadGedungController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_GEDUNG: null,
            NAMA_GEDUNG: null,
            KETERANGAN_GEDUNG: null,
        };
        
        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_GEDUNG = response.data.ID_GEDUNG;
            $scope.formData.NAMA_GEDUNG = response.data.NAMA_GEDUNG;
            $scope.formData.KETERANGAN_GEDUNG = response.data.KETERANGAN_GEDUNG;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {3
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });
    
    angular.module('mainApp').controller('akadRuangController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_RUANG: null,
            GEDUNG_RUANG: null,
            NAMA_RUANG: null,
            KETERANGAN_RUANG: null,
        };

        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            $scope.dataGEDUNG_RUANG = response.data.dataGEDUNG_RUANG;

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_RUANG = response.data.ID_RUANG;
            $scope.formData.GEDUNG_RUANG = response.data.GEDUNG_RUANG;
            $scope.formData.NAMA_RUANG = response.data.NAMA_RUANG;
            $scope.formData.KETERANGAN_RUANG = response.data.KETERANGAN_RUANG;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });
    
    angular.module('mainApp').controller('mdRombelController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_ROMBEL: null,
            NAMA_ROMBEL: null,
            KELAS_ROMBEL: null,
            RUANG_ROMBEL: null,
            KETERANGAN_ROMBEL: null,
        };
        
        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            $scope.dataKELAS_ROMBEL = response.data.dataKELAS_ROMBEL;
            $scope.dataRUANG_ROMBEL = response.data.dataRUANG_ROMBEL;

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_ROMBEL = response.data.ID_ROMBEL;
            $scope.formData.NAMA_ROMBEL = response.data.NAMA_ROMBEL;
            $scope.formData.KELAS_ROMBEL = response.data.KELAS_ROMBEL;
            $scope.formData.RUANG_ROMBEL = response.data.RUANG_ROMBEL;
            $scope.formData.KETERANGAN_ROMBEL = response.data.KETERANGAN_ROMBEL;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {3
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });

    angular.module('mainApp').controller('mdJkController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_JK: null,
            NAMA_JK: null,
            KODE_EMIS_JK: null,
        };
        
        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            callbackFormData(response);
        }

        function callbackFormData(response) {
            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            $scope.formData.ID_JK = response.data.ID_JK;
            $scope.formData.NAMA_JK = response.data.NAMA_JK;
            $scope.formData.KODE_EMIS_JK = response.data.KODE_EMIS_JK;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {
            if ($scope.form.$valid) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }
    });

    angular.module('mainApp').controller('dataPSBController', function ($scope, formHelper, notificationService, $routeParams, $http, $mdDialog, dataScopeShared) {
        $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
        $scope.ajaxRunning = true;
        $scope.dataUpdate = dataScopeShared.getData('DATA_UPDATE');
        $scope.addForm = true;

        $scope.formData = {
            ID_SANTRI: null,
            NAMA_SANTRI: null,
            TEMPAT_LAHIR_SANTRI: null,
            TANGGAL_LAHIR_SANTRI: null,
            KECAMATAN_SANTRI: null,
            ALAMAT_SANTRI: null,
            NOHP_SANTRI: null,
            AYAH_NAMA_SANTRI: null,
        };

        $http.get($scope.mainURI + '/form').then(callbackForm, notificationService.errorCallback);

        function callbackForm(response) {
            $http.get(response.data.uri.kecamatan).then(callbackFormData, notificationService.errorCallback);
        }

        function callbackFormData(response) {
            $scope.dataAutocomplete = response.data;
            $scope.KECAMATAN_SANTRI = formHelper.autocomplete($scope);

            if ($scope.dataUpdate === null || typeof $scope.dataUpdate === 'undefined')
                formReady();
            else
                getData();
        }

        function getData() {
            $http.post($scope.mainURI + '/view', $scope.dataUpdate).then(callbackSuccessData, notificationService.errorCallback);
        }

        function callbackSuccessData(response) {
            angular.forEach($scope.KECAMATAN_SANTRI.dataAll, function (value, key) {
                if (parseInt(response.data.KECAMATAN_SANTRI) === parseInt(value.key)) {
                    $scope.KECAMATAN_SANTRI.selectedItem = value;
                }
            });

            $scope.formData.ID_SANTRI = response.data.ID_SANTRI;
            $scope.formData.NAMA_SANTRI = response.data.NAMA_SANTRI;
            $scope.formData.TEMPAT_LAHIR_SANTRI = response.data.TEMPAT_LAHIR_SANTRI;
            $scope.formData.TANGGAL_LAHIR_SANTRI = response.data.TANGGAL_LAHIR_SANTRI;
            $scope.formData.KECAMATAN_SANTRI = response.data.KECAMATAN_SANTRI;
            $scope.formData.ALAMAT_SANTRI = response.data.ALAMAT_SANTRI;
            $scope.formData.NOHP_SANTRI = response.data.NOHP_SANTRI;
            $scope.formData.AYAH_NAMA_SANTRI = response.data.AYAH_NAMA_SANTRI;

            $scope.addForm = false;

            formReady();
        }

        function formReady() {
            $scope.ajaxRunning = false;
        }

        $scope.cancelSumbit = function () {
            dataScopeShared.addData('DATA_UPDATE', null);
            $mdDialog.cancel();
        };

        $scope.saveSubmit = function () {
            if ($scope.form.KECAMATAN_SANTRI.$valid
                    && $scope.form.NAMA_SANTRI.$valid
                    && $scope.form.TEMPAT_LAHIR_SANTRI.$valid
                    && $scope.form.TANGGAL_LAHIR_SANTRI.$valid
                    && $scope.form.NOHP_SANTRI.$valid
                    && $scope.form.ALAMAT_SANTRI.$valid
                    && $scope.form.AYAH_NAMA_SANTRI.$valid
                    ) {
                $scope.ajaxRunning = true;

                $http.post($scope.mainURI + '/save', $scope.formData).then(callbackSuccessSaving, notificationService.errorCallback);
            } else {
                notificationService.toastSimple('Silahkan periksa kembali masukan Anda');
            }
        };

        function callbackSuccessSaving(response) {
            $scope.ajaxRunning = false;
            $mdDialog.hide(response.data.notification.text);
            dataScopeShared.addData('DATA_UPDATE', null);
        }

        $scope.$watch('KECAMATAN_SANTRI.selectedItem', function (selectedItem) {
            if (typeof selectedItem === 'undefined' || selectedItem.key === null)
                $scope.formData.KECAMATAN_SANTRI = null;
            else
                $scope.formData.KECAMATAN_SANTRI = selectedItem.key;
        });
    });

    angular.module('mainApp').controller('docDatatableController', function ($scope, $timeout, $mdSidenav, $log) {
        $scope.title = 'Dokumentasi';
        $scope.content = 'Isi Dokumentasi';
    });

})();