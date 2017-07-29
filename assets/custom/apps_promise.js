var mainApp = angular.module("mainApp",['ngRoute', 'datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap' , 'datatables.light-columnfilter']);


mainApp.config(['$routeProvider','$locationProvider',
    function($routeProvider,$locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.
            when('/', {
                templateUrl: 'template/show/home.html',
                controller: 'homeController'
            }).
            when('/datatablesAngular', {
                templateUrl: 'template/show/angular_datatables.html',
                controller: 'angularDatatables'
            }).
            when('/datatablesJquery', {
                templateUrl: 'template/show/content.html',
                controller: 'jqueryDatatables'
            });
    }
]);

mainApp.controller('homeController', function($scope,$http){
   
});

mainApp.controller('jqueryDatatables', function($scope,$http){
   
});

mainApp.controller('angularDatatables', function($scope, $compile, DTOptionsBuilder, DTColumnBuilder, $http, $q) {
  var vm = this;
  var titleHtml = '<input type="checkbox" ng-model="showCase.selectAll" ng-click="showCase.toggleAll(showCase.selectAll, showCase.selected)">';
  vm.message = '';
  // vm.someClickHandler = someClickHandler;
  vm.selected = {};
  vm.selectAll = false;
  vm.toggleAll = toggleAll;
  vm.toggleOne = toggleOne;
  vm.edit = edit;
  vm.delete = deleteRow;
  // vm.newSource = 'data/data_2';
  vm.newPromise = newPromise;
  vm.reloadData = reloadData;
  vm.dtInstance = {};
  vm.persons = {};
  vm.dtOptions = 
    DTOptionsBuilder.fromSource('data/data_1')
  // DTOptionsBuilder.fromFnPromise(function() {
  //             var defer = $q.defer();
  //             $http.get('data/data_1').then(function(result) {
  //                 defer.resolve(result.data);
  //             });

  //             return defer.promise;
  //         })
          .withPaginationType('full_numbers')
          .withDisplayLength(10)
          .withOption('createdRow', createdRow)
         // .withDOM('pitrfl');
         .withOption('stateSave', true)
         // .withOption('rowCallback', rowCallback)
         .withOption('headerCallback', headerCallback)
         .withButtons([
          // 'columnsToggle',
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
         .withFixedHeader({
            bottom: true
        })
         .withBootstrap().withLightColumnFilter({
            '1' : {
                type : 'text'
            },
            '2' : {
                type : 'text'
            },
            '3' : {
                type : 'text'
            },
            '4' : {
                type : 'text'
            },
            '5' : {
                type : 'select',
                values: [{
                    value: 'Male', label: 'Male'
                }, {
                    value: 'Female', label: 'Female'
                }]
            },
            '6' : {
                type : 'text'
            }
        })
         .withDOM('<"custom-element">Blfrtip');
  vm.dtColumns = [
      DTColumnBuilder.newColumn(null).withTitle(titleHtml).renderWith(actionsCheckbox),
      DTColumnBuilder.newColumn('id').withTitle('ID'),
      DTColumnBuilder.newColumn('first_name').withTitle('First name'),
      DTColumnBuilder.newColumn('last_name').withTitle('Last name'),
      DTColumnBuilder.newColumn('email').withTitle('Email'),
      DTColumnBuilder.newColumn('gender').withTitle('Gender'),
      DTColumnBuilder.newColumn('ip_address').withTitle('IP Address'),
      DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
  ];

  function edit(person) {
      vm.message = 'You are trying to edit the row: ' + JSON.stringify(person);
      // Edit some data and call server to make changes...
      // Then reload the data so that DT is refreshed
      vm.dtInstance.reloadData();
  }
  function deleteRow(person) {
      vm.message = 'You are trying to remove the row: ' + JSON.stringify(person);
      // Delete some data and call server to make changes...
      // Then reload the data so that DT is refreshed
      vm.dtInstance.reloadData();
  }
  function createdRow(row, data, dataIndex) {
      // Recompiling so we can bind Angular directive to the DT
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
  // function someClickHandler(info) {
  //   vm.message = 'You are trying to click the row: ' + info.id + ' - ' + JSON.stringify(info);
  // }
  // function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
  //   // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
  //   $('td', nRow).unbind('click');
  //   $('td', nRow).bind('click', function() {
  //     $scope.$apply(function() {
  //       vm.someClickHandler(aData);
  //     });
  //   });
  //   return nRow;
  // }
  function headerCallback(header) {
    if (!vm.headerCompiled) {
      // Use this headerCompiled field to only compile header once
      vm.headerCompiled = true;
      $compile(angular.element(header).contents())($scope);
    }
  }
  function actionsCheckbox(data, type, full, meta) {
    vm.selected[full.id] = false;
    return '<input type="checkbox" ng-model="showCase.selected[' + data.id + ']" ng-click="showCase.toggleOne(showCase.selected)">';
  }
  function toggleAll (selectAll, selectedItems) {
      for (var id in selectedItems) {
          if (selectedItems.hasOwnProperty(id)) {
              selectedItems[id] = selectAll;
          }
      }
  }
  function toggleOne (selectedItems) {
      for (var id in selectedItems) {
          if (selectedItems.hasOwnProperty(id)) {
              if(!selectedItems[id]) {
                  vm.selectAll = false;
                  return;
              }
          }
      }
      vm.selectAll = true;
  }
});

mainApp.directive('datatableWrapper', function ($timeout, $compile) {
    return {
        restrict: 'E',
        transclude: true,
        template: '<ng-transclude></ng-transclude>',
        link: function (scope, element) {
          $timeout(function () {
              $compile(element.find('.custom-element'))(scope);
          }, 0, false);
        }
    };
});

mainApp.directive('customElement', function () {
    return {
        restrict: 'C',
        template: '<h1>My custom element</h1>'
    };
});

mainApp.run(function (DTDefaultOptions) {
    DTDefaultOptions.setLoadingTemplate('Sedang mengambil data...');
});