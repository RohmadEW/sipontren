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