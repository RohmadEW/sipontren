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

mainApp.run(function ($rootScope, $location, $timeout) {
    $rootScope.$on("$routeChangeStart", function (event, next, current) {
        if ($rootScope.loggedUser === null || typeof $rootScope.loggedUser === 'undefined') {
            if (next.templateUrl === 'template/show/login.html') {

            } else {
                $location.path("/login/login");
            }
        }
    });
    $rootScope.$on('$routeChangeSuccess', function (scope, next, current) {
        $timeout(function () {
            var footer_height = angular.element('.main-footer').outerHeight() || 0;
            var neg = angular.element('.main-header').outerHeight() + footer_height;
            var window_height = angular.element(window).height();
            angular.element(".content-wrapper, .right-side").css('min-height', window_height - neg);
        });
    });
});