mainApp.controller('simapesTables', function ($scope, $rootScope, $routeParams, $http, generalService, $timeout, $log, dataScopeShared, datatablesService, notificationService, $route, $templateCache) {
    dataScopeShared.addData('RESPONSE_INFO', null);
    console.log('ROOT SCOPE',$rootScope);
    $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
    $scope.columnReady = false;
    $scope.message = '';
    $scope.title = 'Processing...';
    $scope.reloadPage = reloadPage;
    $scope.deleteRow = deleteRow;
    $scope.editRow = editRow;
    $scope.reloadDatatables = reloadDatatables;
    $scope.removeLastField = removeLastField;
    $scope.dataChanged = {};
    $scope.headerFilter = {};
    $scope.idModal = 'modalForm';
    $scope.buttonTopDatatables = {};

    $http.get($scope.mainURI + '/info').then(successCallback, generalService.errorCallback);

    function successCallback(response) {
        $scope.response = response.data;
        $scope.response.urlDatatables = $scope.mainURI + $scope.response.urlDatatables;

        $scope = datatablesService.create($scope);

        dataScopeShared.addData('RESPONSE_INFO', $scope.response);

        removeLastField();

        $scope.columnReady = true;
    }

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

    $scope.onSubmit = function (form) {
        $scope.laddaLoading = true;
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            $http.post($scope.mainURI + $scope.response.urlSave, $scope.model).then(successCallback, generalService.errorCallback);

            function successCallback(response) {
                notificationService.flash(response.data.notification);
                notificationService.swalDestroy();
                reloadDatatables();
                $scope.modaltitle = $scope.response.titleAdd;

                $timeout(function () {
                    angular.element('#' + $scope.idModal).modal('hide');
                });

                removeLastField();
            }
        } else {
            $scope.laddaLoading = false;
        }
    };

    function editRow(id) {
        $scope.modaltitle = $scope.response.titleEdit;

        if ($scope.response.idEditable)
            $timeout(function () {
                angular.element("#" + $scope.response.id).removeAttr('readonly');
                angular.element("#" + $scope.response.id).attr('placeholder', ' ');
            });
        else
            $timeout(function () {
                angular.element("#" + $scope.response.id).attr('readonly', 'true');
            });

        var dataPost = {
            id: id
        };

        $http.post($scope.mainURI + $scope.response.urlView, dataPost).then(successCallback, generalService.errorCallback);

        function successCallback(response) {
            $scope.model = response.data;
        }
    }

    function deleteRow(id) {
        var dataPost = {
            id: id
        };

        notificationService.swalOptionAjax('Apakah Anda yakin?', 'Data yang telah dihapus tidak dapat dikembalikan. Pastikan data yang akan Anda hapus adalah benar', 'warning', function (isConfirm) {
            if (isConfirm)
                deletingRow(dataPost);
        });
    }

    function deletingRow(dataPost) {
        $http.post($scope.mainURI + $scope.response.urlDelete, dataPost).then(successCallback, generalService.errorCallback);

        function successCallback(response) {
            notificationService.flash(response.data.notification);
            notificationService.swalDestroy();
            reloadDatatables();
        }
    }
    
    function reloadPage() {
        var currentPageTemplate = $route.current.templateUrl;
        $templateCache.remove(currentPageTemplate);
        $route.reload();
    }

    function reloadDatatables() {
        $timeout(function () {
            angular.element('#reloadDatatables').triggerHandler('click');
        });
    }

    function removeLastField() {
        delete $scope.model;

        $scope.modaltitle = $scope.response.titleAdd;
        $scope.form = $scope.response.modal.form;
        $scope.schema = $scope.response.modal.schema;
        $scope.model = {};
        $scope.$broadcast('schemaFormRedraw');
        $scope.laddaLoading = false;

        if ($scope.response.idInsertable)
            $timeout(function () {
                angular.element("#" + $scope.response.id).removeAttr('readonly');
            });
        else
            $timeout(function () {
                angular.element("#" + $scope.response.id).attr('readonly', 'true');
                angular.element("#" + $scope.response.id).attr('placeholder', 'OTOMATIS');
            });
    }
});