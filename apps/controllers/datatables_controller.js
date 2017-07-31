mainApp.controller('simapesTables', function ($scope, $routeParams, $http, generalService, $timeout, $uibModal, $log, dataScopeShared, datatablesService) {
    dataScopeShared.addData('RESPONSE_INFO', null);

    $scope.mainURI = $routeParams.thecontroller;
    $scope.columnReady = false;
    $scope.message = '';
    $scope.title = 'Processing...';
    $scope.selected = {};
    $scope.selectAll = false;
    $scope.deleteRow = deleteRow;
    $scope.reloadDatatables = reloadDatatables;
    $scope.dataChanged = {};
    $scope.headerFilter = {};

    $scope.modalOpen = function (id) {
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalForm.html',
            controller: 'ModalInstanceCtrl',
            size: 'lg',
            backdrop: 'static'
        });

        dataScopeShared.addData('DATA_CHANGED_INFO', id ? $scope.dataChanged[id] : null);

        modalInstance.result.then(function () {
            $log.info('Modal closed');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $http.get($scope.mainURI + '/info').then(successCallback, generalService.errorCallback);

    function successCallback(response) {
        $scope.response = response.data;

        $scope = datatablesService.create($scope);

        dataScopeShared.addData('RESPONSE_INFO', $scope.response);

        $scope.columnReady = true;
    }

    function deleteRow(id) {
        var dataPost = {
            id: id
        };

        $http.post($scope.response.urlDelete, dataPost).then(successCallback, generalService.errorCallback);

        function successCallback(response) {
            if (response.data.status) {
                alert('Sukses menghapus data.');

                $scope.reloadDatatables();
            } else {
                alert('Gagal menghapus data.');
            }
        }
    }

    function reloadDatatables() {
        $timeout(function () {
            angular.element('#reloadDatatables').triggerHandler('click');
        });
    }
});

mainApp.controller('ModalInstanceCtrl', function ($scope, $http, $uibModalInstance, $q, $timeout, generalService, $routeParams, dataScopeShared) {
    $scope.mainURI = $routeParams.thecontroller;
    $scope.dataShared = dataScopeShared.getData('RESPONSE_INFO');
    $scope.dataChanged = dataScopeShared.getData('DATA_CHANGED_INFO');

    $scope.modalSubmit = function () {
        $uibModalInstance.close();
    };

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    if ($scope.dataShared === null) {
        alert("Halaman belum siap membuat form.");
    } else {
        $scope.form = $scope.dataShared.modal.edit ? $scope.dataShared.modal.edit.form : $scope.dataShared.modal.add.form;
        $scope.schema = $scope.dataShared.modal.edit ? $scope.dataShared.modal.edit.schema : $scope.dataShared.modal.add.schema;
        $scope.model = {};

        if ($scope.dataChanged !== null) {
            var dataPost = {
                id: $scope.dataChanged.id
            };

            $http.post($scope.dataShared.urlView, dataPost).then(successCallback, generalService.errorCallback);
        }

        function successCallback(response) {
            $scope.model = response.data;
        }
    }

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);
});