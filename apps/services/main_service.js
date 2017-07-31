mainApp.run(function (DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('Sedang mengambil data...');
});

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
                        actionHTML += '<button class="btn btn-' + value.class + ' btn-sm btn-flat" ng-click="' + value.function + '(' + data.id + ')" title="' + value.title + '"><i class="fa fa-' + value.fa + '"></i></button>&nbsp;';
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
                .withLanguage({
                    "sProcessing": "Sedang mengambil data...",
                    "sLengthMenu": "Tampilkan _MENU_ entri",
                    "sZeroRecords": "Tidak ditemukan data yang sesuai",
                    "sInfo": "Menampilkan _START_ sampai _END_ dari _TOTAL_ entri",
                    "sInfoEmpty": "Menampilkan 0 sampai 0 dari 0 entri",
                    "sInfoFiltered": "(disaring dari _MAX_ entri keseluruhan)",
                    "sInfoPostFix": "",
                    "sSearch": "Cari:",
                    "sUrl": "",
                    "oPaginate": {
                        "sFirst": "<i class='fa fa-angle-double-left'></i>",
                        "sLast": "<i class='fa fa-angle-double-right'></i>",
                        "sPrevious": "<i class='fa fa-angle-left'></i>",
                        "sNext": "<i class='fa fa-angle-right'></i>"
                    }
                })
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
//                            dt.ajax.reload();
                            $scope.reloadDatatables();
                        }
                    },
                    $scope.buttonAddDatatables
                ])
                .withBootstrap()
                .withLightColumnFilter($scope.columnsFilter)
                .withDOM("<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3 text-right'f>>t<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>");

        $scope.dtInstance = {};

        return $scope;
    };
});
