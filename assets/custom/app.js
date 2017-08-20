var mainApp = angular.module('mainApp', ['ngMaterial', 'ngRoute']);

// STATIC VARIABLES
mainApp.value('url_menu', 'template/menu');
mainApp.value('url_info', 'template/info');

// SERVICES APP
mainApp.service('generalService', function ($location) {
    this.errorCallback = function (error) {
        if (error.status == 403) {
            $location.path("/user-login/login");
        }

        swal({
            title: 'Error Ajax Response (XHR Failed)',
            text: 'Status: ' + error.status + ' - ' + error.statusText + ' <hr>Message:<br>' + error.data,
            type: 'error',
            html: true,
        });
    };
});

// CONTROLLERS APP
mainApp.controller('DemoBasicCtrl', function () {});

mainApp.controller('headerController', function ($scope, $http, url_menu, generalService, $location) {
    $http.get(url_menu).then(callbackMenu, generalService.errorCallback);
    
    function callbackMenu(response) {
        $scope.name_app = response.data.name_app;
        $scope.menus = response.data.menus;
    }

    $scope.go = function (menus) {
        $location.path(menus.link);
    }
});
