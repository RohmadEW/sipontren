mainApp.run(function (DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('Sedang mengambil data...');
});

mainApp.service('generalService', function () {
    this.errorCallback = function (error) {
//        alert('Status: ' + error.status + ' - ' + error.statusText + ' \n\nMessage:\n' + error.data);
        swal({
            title: 'Error Ajax Response (XHR Failed)',
            text: 'Status: ' + error.status + ' - ' + error.statusText + ' <hr>Message:<br>' + error.data,
            type: 'error',
            html: true,
        });
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

mainApp.service("datatablesService", function (DTColumnBuilder, DTOptionsBuilder, $compile, $timeout) {
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
                        var functionAction = null;

                        if (value.type === 'ng')
                            functionAction = 'ng-click="' + value.function + '(' + data.id + ')"';
                        else if (value.type === 'modal')
                            functionAction = 'data-toggle="modal" data-target="#' + $scope.idModal + '" ng-click="' + value.function + '(' + data.id + ')"';

                        actionHTML += '<button class="btn btn-' + value.class + ' btn-sm btn-flat" ' + functionAction + ' title="' + value.title + '"><i class="fa fa-' + value.fa + '"></i></button>&nbsp;';
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
                $timeout(function () {
                    angular.element('#' + $scope.idModal).modal('show');
                });
            }
        } : {};

        $scope.buttonDatatables = [
//                    {extend: 'copy', text: '<i class="fa fa-clone"></i>&nbsp;&nbsp;Salin', className: 'btn btn-primary btn-flat'},
//                    {extend: 'csv', text: '<i class="fa fa-file-excel-o"></i>&nbsp;&nbsp;CSV', title: 'Download data dalam CSV', className: 'btn btn-primary btn-flat'},
            {
                extend: 'pdf', 
                text: '<i class="fa fa-file-pdf-o"></i>&nbsp;&nbsp;PDF', 
                title: 'Download data dalam PDF', className: 'btn btn-primary btn-flat'
            },
            {
                extend: 'excel', 
                text: '<i class="fa fa-file-excel-o"></i>&nbsp;&nbsp;XLSX', 
                title: 'Download data dalam XLS', 
                className: 'btn btn-primary btn-flat'
            },
            {
                extend: 'print', 
                text: '<i class="fa fa-print"></i>&nbsp;&nbsp;Cetak', 
                className: 'btn btn-primary btn-flat'
            },
            {
                text: '<i class="fa fa-refresh"></i>&nbsp;&nbsp;Muat Ulang',
                className: 'btn btn-primary btn-flat',
                action: function (e, dt, node, config) {
//                            dt.ajax.reload();
                    $scope.reloadDatatables();
                }
            }
        ];

        $scope.buttonDatatables = $scope.buttonDatatables.concat($scope.buttonAddDatatables);
        $scope.buttonDatatables = $scope.buttonDatatables.concat($scope.buttonTopDatatables);

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
                .withButtons($scope.buttonDatatables)
                .withBootstrap()
                .withLightColumnFilter($scope.columnsFilter)
                .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                .withDOM("<'row'<'col-sm-3'l><'col-sm-6 text-center'B><'col-sm-3 text-right'f>>t<'row'<'col-sm-6'i><'col-sm-6 text-right'p>>");

        $scope.dtInstance = {};

        return $scope;
    };
});

mainApp.service("notificationService", function (toastr) {
    this.swalOption = function (title, text, type, callback) {
        swal({
            title: title,
            text: text,
            type: type,
            html: true,
            showCancelButton: true,
            confirmButtonColor: type === 'warning' ? "#DD6B55" : "#00c0ef",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak"
        },
                callback);

    };

    this.swalOptionAjax = function (title, text, type, callbackAfterAjaxDone) {
        swal({
            title: title,
            text: text,
            type: type,
            html: true,
            showCancelButton: true,
            confirmButtonColor: type === 'warning' ? "#DD6B55" : "#00c0ef",
            confirmButtonText: "Ya",
            cancelButtonText: "Tidak",
            closeOnConfirm: false,
            showLoaderOnConfirm: true
        },
                callbackAfterAjaxDone);

    };

    this.swalInput = function (title, text, placeholder, callback) {
        swal({
            title: title,
            text: text,
            type: 'input',
            html: true,
            showCancelButton: true,
            confirmButtonColor: type === 'warning' ? "#DD6B55" : "#00c0ef",
            confirmButtonText: "OK",
            cancelButtonText: "Batalkan",
            closeOnConfirm: false,
            animation: "slide-from-top",
            inputPlaceholder: placeholder
        },
                callback);

//                callback = function(inputValue){
//  if (inputValue === false) return false;
//  
//  if (inputValue === "") {
//    swal.showInputError("You need to write something!");
//    return false
//  }
//  
//  swal("Nice!", "You wrote: " + inputValue, "success");
//}

    };

    this.swalTimer = function (title, text) {
        swal({
            title: title,
            text: text,
            timer: 2000,
            html: true,
            showConfirmButton: false
        });
    };

    this.swalDestroy = function () {
        swal.close();
    };

    this.flash = function (data) {
        var buttonClose = {
            closeButton: true,
            closeHtml: '<button>x</button>'
        };

        if (data.type === 'info')
            toastr.info(data.title, data.text, buttonClose);
        else if (data.type === 'success')
            toastr.success(data.title, data.text, buttonClose);
        else if (data.type === 'error')
            toastr.error(data.title, data.text, buttonClose);
        else if (data.type === 'warning')
            toastr.warning(data.title, data.text, buttonClose);
    };
});