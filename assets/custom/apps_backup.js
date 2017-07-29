var mainApp = angular.module("mainApp", ['ngRoute', 'datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap', 'datatables.light-columnfilter']);

mainApp.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.
                when('/:name', {
                    templateUrl: function (urlattr) {
                        return 'template/show/' + urlattr.name + '.html';
                    }
                })
                .otherwise({
                    redirectTo: '/home'
                });
    }
]);

mainApp.controller('homeController', function ($scope, $http) {

});

mainApp.controller('jqueryDatatables', function ($scope, $http) {

});

mainApp.controller('angularDatatables', function ($scope, $compile, DTOptionsBuilder, DTColumnBuilder, $http, $q, $resource) {
    var vm = this;
    var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
    vm.message = '';
    vm.columns = {};
    vm.columnsFilter = {};
    vm.title = 'Processing...';
    vm.selected = {};
    vm.selectAll = false;
    vm.toggleAll = toggleAll;
    vm.toggleOne = toggleOne;
    vm.edit = edit;
    vm.delete = deleteRow;
    vm.newPromise = newPromise;
    vm.reloadData = reloadData;
    // vm.createHeader = createHeader;
    vm.dtInstance = {};
    vm.persons = {};
    vm.headerFilter = {};
     vm.dtColumns = [
       DTColumnBuilder.newColumn(null).withTitle(titleHtml).renderWith(actionsCheckbox),
       DTColumnBuilder.newColumn('id').withTitle('ID'),
       DTColumnBuilder.newColumn('first_name').withTitle('First name'),
       DTColumnBuilder.newColumn('last_name').withTitle('Last name'),
       DTColumnBuilder.newColumn('email').withTitle('Last name'),
       DTColumnBuilder.newColumn('gender').withTitle('Last name'),
       DTColumnBuilder.newColumn('ip_address').withTitle('Last name'),
       DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
     ];
    vm.dtOptions = DTOptionsBuilder.newOptions()
            .withOption('ajax', {
                url: 'data/data_3',
                type: 'POST'
            })
            // .withDataProp('data')
            .withDataProp(function (data) {
                vm.title = data.title;
                vm.columns = data.columns;
                console.log('DATA FULL', vm.columns);

                // createHeader;

                return data.data;
            })
            .withOption('processing', true)
            .withOption('serverSide', true)
//            .withFnServerData((sSource, aoData, fnCallback, oSettings) => {
//                $http.post('data/data_3', {
//                    start: aoData[3].value,
//                    length: aoData[4].value,
//                    draw: aoData[0].value,
//                    order: aoData[2].value,
//                    search: aoData[5].value,
//                    columns: aoData[1].value
//                }).then((data) => {
//                    console.log('DATA RESPONSE', data);
//                    for (var column in data.data.columns) {
//                        console.log('COLUMN', column);
////                        vm.dtColumns.push(DTColumnBuilder.newColumn(column.id).withTitle(column.title));
//                    }
//                    
////                    fnCallback(data.data);
//                });
//            })
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('createdRow', createdRow)
            .withOption('stateSave', true)
            .withOption('headerCallback', headerCallback)
            .withButtons([
                'colvis',
                'copy',
                'print',
                'excel',
                {
                    text: 'Some button',
                    key: '1',
                    action: function (e, dt, node, config) {
                        alert('Button activated');
                    }
                }
            ])
            .withBootstrap()
            // .withLightColumnFilter({
            //   sPlaceHolder: 'head:after',
            //   aoColumns: vm.columnsFilter ? vm.columnsFilter : null
            // })
            .withDOM('Blfrtip');

    // function createHeader() {
    //     angular.foreach(vm.columns, function(index, column){
    //         console.log('COLUMN', column);
    //         vm.dtColumns.push(DTColumnBuilder.newColumn(column.id).withTitle(column.title));
    //     });
    // }

    function edit(person) {
        vm.message = 'You are trying to edit the row: ' + JSON.stringify(person);
        vm.dtInstance.reloadData();
    }
    function deleteRow(person) {
        vm.message = 'You are trying to remove the row: ' + JSON.stringify(person);
        vm.dtInstance.reloadData();
    }
    function createdRow(row, data, dataIndex) {
        $compile(angular.element(row).contents())($scope);
    }
    function actionsHtml(data, type, full, meta) {
        vm.persons[data.id] = data;
        return '<button class="btn btn-warning" ng-click="showCase.edit(showCase.persons[' + data.id + '])">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button class="btn btn-danger" ng-click="showCase.delete(showCase.persons[' + data.id + '])" )"="">' +
                '   <i class="fa fa-trash-o"></i>' +
                '</button>';
    }
    function newPromise() {
        return $resource('data/data_2').query().$promise;
    }
    function reloadData() {
        var resetPaging = false;
        vm.dtInstance.reloadData(callback, resetPaging);
    }
    function callback(json) {
        console.log(json);
    }
    function headerCallback(header) {
        if (!vm.headerCompiled) {
            vm.headerCompiled = true;
            $compile(angular.element(header).contents())($scope);
        }
    }
    function actionsCheckbox(data, type, full, meta) {
        vm.selected[full.id] = false;
        return '<input type="checkbox" ng-model="showCase.selected[' + data.id + ']" ng-click="showCase.toggleOne(showCase.selected)">';
    }
    function toggleAll(selectAll, selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                selectedItems[id] = selectAll;
            }
        }
    }
    function toggleOne(selectedItems) {
        for (var id in selectedItems) {
            if (selectedItems.hasOwnProperty(id)) {
                if (!selectedItems[id]) {
                    vm.selectAll = false;
                    return;
                }
            }
        }
        vm.selectAll = true;
    }
});
//
//mainApp.directive('customElement', function () {
//    return {
//        restrict: 'C',
//        template: '<h1>My custom element</h1>'
//    };
//});

mainApp.run(function (DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('Sedang mengambil data...');
});