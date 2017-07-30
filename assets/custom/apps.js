var mainApp = angular.module("mainApp", ['ngRoute', 'datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap', 'datatables.light-columnfilter', 'schemaForm', 'ui.bootstrap']); //, 'ngMaterial', 'ngAnimate'

mainApp.value('url_menu', 'template/menu');
mainApp.value('url_info', 'template/info');

mainApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.
                when('/:name/:thecontroller', {
                    templateUrl: function (urlattr) {
                        return 'template/show/' + urlattr.name + '.html';
                    }
                })
                .otherwise({
                    redirectTo: '/home/home'
                });
    }
]);

mainApp.service('generalService', function () {
    this.errorCallback = function (error) {
        alert('Status: ' + error.status + ' - ' + error.statusText + ' \n\nMessage:\n' + error.data);
    };
});

mainApp.service("dataScopeShared", function () {
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

mainApp.service("datatablesService", function (DTColumnBuilder, DTOptionsBuilder, $compile) {
    this.create = function ($scope) {
        $scope.dtColumns = [];
        $scope.columnsFilter = [];

        angular.forEach($scope.response.columns, function (column, key) {
            var col = DTColumnBuilder.newColumn(column.id).withTitle(column.title);

            if (column.unsortable)
                col.notSortable();

            if (column.render)
                col.renderWith(function (data, type, full, meta) {
                    $scope.dataChanged[data.id] = data;

                    var actionHTML = '';

                    angular.forEach(column.render, function (value, index) {
                        actionHTML += '<button class="btn btn-' + value.class + ' btn-sm btn-flat" ng-click="' + value.function + '(' + data.id + ')" title="' + value.title + '"><i class="fa fa-' + value.fa + '"></i></button>';
                    });

                    return actionHTML;
                });

            $scope.dtColumns.push(col);
            $scope.columnsFilter.push(column.filter);
        });

        $scope.buttonAddDatatables = $scope.response.requestAdd ? {
            text: '<i class="fa fa-plus"></i>&nbsp;&nbsp;Tambah',
            className: 'btn btn-primary btn-flat',
            action: function (e, dt, node, config) {
                $scope.modalOpen();
            }
        } : {};

        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: $scope.response.urlDatatables,
                    type: 'POST'
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withOption('createdRow', function (row, data, dataIndex) {
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('stateSave', true)
                .withOption('headerCallback', function (header) {
                    if (!$scope.headerCompiled) {
                        $scope.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withButtons([
                    {extend: 'copy', text: '<i class="fa fa-clone"></i>&nbsp;&nbsp;Salin', className: 'btn btn-primary btn-flat'},
//                    {extend: 'csv', text: '<i class="fa fa-file-excel-o"></i>&nbsp;&nbsp;CSV', title: 'Download data dalam CSV', className: 'btn btn-primary btn-flat'},
                    {extend: 'pdf', text: '<i class="fa fa-file-pdf-o"></i>&nbsp;&nbsp;PDF', title: 'Download data dalam PDF', className: 'btn btn-primary btn-flat'},
                    {extend: 'excel', text: '<i class="fa fa-file-excel-o"></i>&nbsp;&nbsp;XLSX', title: 'Download data dalam XLS', className: 'btn btn-primary btn-flat'},
                    {extend: 'print', text: '<i class="fa fa-print"></i>&nbsp;&nbsp;Cetak', className: 'btn btn-primary btn-flat'},
                    {
                        text: '<i class="fa fa-refresh"></i>&nbsp;&nbsp;Muat Ulang',
                        className: 'btn btn-primary btn-flat',
                        action: function (e, dt, node, config) {
                            dt.ajax.reload();
                        }
                    },
                    $scope.buttonAddDatatables
                ])
                .withBootstrap()
                .withLightColumnFilter($scope.columnsFilter)
                .withDOM("<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3 text-right'f>>t<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>");

        return $scope;
    };
});

mainApp.controller('headerController', function ($scope, $http, generalService, url_menu) {
    $http.get(url_menu).then(callbackMenu, generalService.errorCallback);

    function callbackMenu(response) {
        $scope.name_app = response.data.name_app;
        $scope.menus = response.data.menu;
    }
});

mainApp.controller('footerController', function ($scope, $http, generalService, url_info) {
    $http.get(url_info).then(callbackInfo, generalService.errorCallback);

    function callbackInfo(response) {
        $scope.info = response.data;
    }
});

mainApp.controller('homeController', function ($scope, $http, $q, $timeout) {

});

mainApp.controller('simapesTables', function ($scope, $routeParams, $http, generalService, $timeout, $uibModal, $log, dataScopeShared, datatablesService) {
    dataScopeShared.addData('RESPONSE_INFO', null);

    $scope.mainURI = $routeParams.thecontroller;
    $scope.columnReady = false;
    $scope.message = '';
    $scope.title = 'Processing...';
    $scope.selected = {};
    $scope.selectAll = false;
    $scope.edit = edit;
    $scope.delete = deleteRow;
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

    function edit(id) {
        $scope.message = 'You are trying to edit the row: ' + JSON.stringify($scope.dataChanged[id]);
        $scope.reloadDatatables();
    }
    function deleteRow(data) {
        $scope.message = 'You are trying to remove the row: ' + JSON.stringify(data);
        $scope.reloadDatatables();
    }
    function reloadDatatables() {
        $timeout(function () {
            angular.element('#reloadDatatables').triggerHandler('click');
        });
    }
    function callback(json) {
        console.log(json);
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
            
        if($scope.dataChanged !== null) $http.get($scope.dataShared.urlView + $scope.dataChanged.id).then(successCallback, generalService.errorCallback);

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

mainApp.run(function (DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('Sedang mengambil data...');
});