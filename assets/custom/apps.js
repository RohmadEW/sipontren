var mainApp = angular.module("mainApp", ['ngRoute', 'datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap', 'datatables.light-columnfilter', 'schemaForm', 'ngMaterial', 'ngAnimate', 'ui.bootstrap']);

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
                    redirectTo: '/home'
                });
    }
]);

mainApp.service('generalService', function () {
    this.errorCallback = function (error) {
        alert('Status: ' + error.status + ' - ' + error.statusText + ' \n\nMessage:\n' + error.data);
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

mainApp.controller('homeController', function ($scope, $http) {

});

mainApp.controller('simapesTables', function ($scope, $routeParams, $compile, DTOptionsBuilder, DTColumnBuilder, $http, $q, $resource, generalService, $timeout, $uibModal, $log, $document) {
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

    $scope.modalOpen = function (size, parentSelector) {
        var parentElem = parentSelector ? angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'modalForm.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            appendTo: parentElem
        });

        modalInstance.result.then(function () {
            $log.info('Modal closed');
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $http.get($scope.mainURI + '/info').then(successCallback, generalService.errorCallback);

    function successCallback(response) {
        $scope.response = response.data;

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

        $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: $scope.response.url,
                    type: 'POST'
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withPaginationType('full_numbers')
                .withDisplayLength(10)
                .withOption('createdRow', createdRow)
                .withOption('stateSave', true)
                .withOption('headerCallback', headerCallback)
                .withButtons([
                    {extend: 'copy', text: '<i class="fa fa-clone"></i>&nbsp;&nbsp;Salin', className: 'btn btn-primary btn-flat'},
                    {extend: 'csv', text: '<i class="fa fa-file-excel-o"></i>&nbsp;&nbsp;CSV', title: 'Download data dalam CSV', className: 'btn btn-primary btn-flat'},
                    {extend: 'pdf', text: '<i class="fa fa-file-pdf-o"></i>&nbsp;&nbsp;PDF', title: 'Download data dalam PDF', className: 'btn btn-primary btn-flat'},
                    {extend: 'excel', text: '<i class="fa fa-file-excel-o"></i>&nbsp;&nbsp;XLSX', title: 'Download data dalam XLS', className: 'btn btn-primary btn-flat'},
                    {extend: 'print', text: '<i class="fa fa-print"></i>&nbsp;&nbsp;Cetak', className: 'btn btn-primary btn-flat'},
                    {
                        text: '<i class="fa fa-refresh"></i>&nbsp;&nbsp;Muat Ulang',
                        className: 'btn btn-primary btn-flat',
                        action: function (e, dt, node, config) {
                            dt.ajax.reload();
                        }
                    }
                ])
                .withBootstrap()
                .withLightColumnFilter($scope.columnsFilter)
                .withDOM("<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3 text-right'f>>t<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>");

        $scope.dtInstance = {};
        $scope.columnReady = true;

//        resetTemplate();

//        console.log('INSTANCE', $scope);
    }

    function resetTemplate() {
        var buttonDatatables = angular.element(document.querySelector('.dt-button'));
        buttonDatatables.addClass('btn btn-primary btn-flat');
        buttonDatatables.removeClass('dt-button');
    }

    function edit(id) {
        $scope.message = 'You are trying to edit the row: ' + JSON.stringify($scope.dataChanged[id]);
        $scope.reloadDatatables();
    }
    function deleteRow(data) {
        $scope.message = 'You are trying to remove the row: ' + JSON.stringify(data);
        $scope.reloadDatatables();
    }
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function reloadDatatables() {
        $timeout(function () {
            angular.element('#reloadDatatables').triggerHandler('click');
        });
    }
    function callback(json) {
        console.log(json);
    }
    function headerCallback(header) {
        if (!$scope.headerCompiled) {
            $scope.headerCompiled = true;
            $compile(angular.element(header).contents())($scope);
        }
    }
});

mainApp.directive('buttonDirective', function () {
    return {
        restrict: 'E',
        template: '<button type="button" class="btn btn-primary btn-flat animated fadeIn" ng-click="modalOpen(\'lg\')"><i class="fa fa-plus"></i>&nbsp;&nbsp;Tambah</button>'
    };
});

mainApp.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, $q, $timeout) {
    $scope.modalSubmit = function () {
        $uibModalInstance.close();
    };

    $scope.cancelModal = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.schema = {
        "type": "object",
        "title": "Comment",
        "properties": {
            "name": {
                "title": "Name",
                "type": "string"
            },
            "email": {
                "title": "Email",
                "type": "string",
                "pattern": "^\\S+@\\S+$",
                "description": "Email will be used for evil."
            },
            "comment": {
                "title": "Comment",
                "type": "string"
            }
        },
        "required": ["name", "email", "comment"]
    };

    $scope.form = [
        {
            key: 'name',
            placeholder: 'Anything but "Bob"',
            $asyncValidators: {
                'async': function (name) {
                    var deferred = $q.defer();
                    $timeout(function () {
                        if (angular.isString(name) && name.toLowerCase().indexOf('bob') !== -1) {
                            deferred.reject();
                        } else {
                            deferred.resolve();
                        }
                    }, 500);
                    return deferred.promise;
                }
            },
            validationMessage: {
                'async': "Wooohoo thats not an OK name!"
            }

        },
        {
            key: 'email',
            placeholder: 'Not MY email',
            ngModel: function (ngModel) {
                ngModel.$validators.myMail = function (value) {
                    return value !== 'david.lgj@gmail.com';
                };
            },
            validationMessage: {
                'myMail': "Thats my mail!"
            }
        },
        {
            "key": "comment",
            "type": "textarea",
            "placeholder": "Make a comment, write 'damn' and check the model",
            $parsers: [
                function (value) {
                    if (value && value.replace) {
                        return value.replace(/(damn|fuck|apple)/, '#!@%&');
                    }
                    return value;
                }
            ]
        },
        {
            "type": "submit",
            "style": "btn-info",
            "title": "OK"
        }
    ];

    $scope.model = {};

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);
});

mainApp.run(function (DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('Sedang mengambil data...');
});