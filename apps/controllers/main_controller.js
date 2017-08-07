mainApp.controller('headerController', function ($scope, $rootScope, menuService) {
    menuService.request($scope);

    $scope = $rootScope;
});

mainApp.controller('footerController', function ($scope, $http, generalService, url_info) {
    $http.get(url_info).then(callbackInfo, generalService.errorCallback);

    function callbackInfo(response) {
        $scope.info = response.data;
    }
});

mainApp.controller('homeController', function ($scope, $http, $q, $timeout) {

});