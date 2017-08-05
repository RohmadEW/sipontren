var mainApp = angular.module("mainApp", ['ngRoute', 'datatables', 'ngResource', 'datatables.buttons', 'datatables.bootstrap', 'datatables.light-columnfilter', 'schemaForm', 'toastr', 'ngAnimate', 'angular-ladda']); //, 'ngMaterial', 'ngAnimate', 'ui.bootstrap'

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