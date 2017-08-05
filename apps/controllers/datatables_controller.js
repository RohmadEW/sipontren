mainApp.controller('simapesTables', function ($scope, $routeParams, $http, generalService, $timeout, $log, dataScopeShared, datatablesService, notificationService) { // $uibModal
    dataScopeShared.addData('RESPONSE_INFO', null);

    $scope.mainURI = $routeParams.thecontroller;
    $scope.columnReady = false;
    $scope.message = '';
    $scope.title = 'Processing...';
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

        $scope = datatablesService.create($scope);

        dataScopeShared.addData('RESPONSE_INFO', $scope.response);

        createForm();

        $scope.columnReady = true;
    }

    function createForm() {
        $scope.form = $scope.response.modal.edit ? $scope.response.modal.edit.form : $scope.response.modal.add.form;
        $scope.schema = $scope.response.modal.edit ? $scope.response.modal.edit.schema : $scope.response.modal.add.schema;
        $scope.model = {};
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
            $http.post($scope.response.urlSave, $scope.model).then(successCallback, generalService.errorCallback);

            function successCallback(response) {
                notificationService.flash(response.data.notification);
                notificationService.swalDestroy();
                reloadDatatables();
            }
            
            $timeout(function () {
                angular.element('#' + $scope.idModal).modal('hide');
            });
            
            removeLastField();
        }
    };

    function editRow(id) {
        var dataPost = {
            id: id
        };

        $http.post($scope.response.urlView, dataPost).then(successCallback, generalService.errorCallback);

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
        $http.post($scope.response.urlDelete, dataPost).then(successCallback, generalService.errorCallback);

        function successCallback(response) {
            notificationService.flash(response.data.notification);
            notificationService.swalDestroy();
            reloadDatatables();
        }
    }

    function reloadDatatables() {
        $timeout(function () {
            angular.element('#reloadDatatables').triggerHandler('click');
        });
    }

    function removeLastField() {
        delete $scope.model;
        $scope.model = {};
        $scope.$broadcast('schemaFormRedraw');
        $scope.laddaLoading = false;
    }
});