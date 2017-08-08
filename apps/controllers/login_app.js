mainApp.controller('loginApps', function ($scope, $rootScope, $routeParams, $http, generalService, $timeout, notificationService, $location, menuService) {
    $scope.checkingSessionOnServer = true;
    $scope.mainURI = $routeParams.ci_dir + '/' + $routeParams.ci_class;
    $scope.removeLastField = removeLastField;
    checkSessionOnServer();

    if($rootScope.loggedUser) redirectLoggedIn();

    $scope.form = [
        {
            "key": "username",
            "type": "text",
            "placeholder": "Username"
        },
        {
            "key": "password",
            "type": "password",
            "placeholder": "Password"
        }
    ];
    $scope.schema = {
        "type": "object",
        "title": "Login",
        "properties": {
            "username": {
                "title": "Username",
                "type": "string",
            },
            "password": {
                "title": "Password",
                "type": "string",
            },
        },
        "required": [
            "username",
            "password"
        ]
    };
    $scope.model = {};

    $scope.$watch('model', function (value) {
        if (value) {
            $scope.prettyModel = JSON.stringify(value, undefined, 2);
        }
    }, true);

    $scope.onSubmit = function (form) {
        $scope.laddaLoading = true;
        $scope.$broadcast('schemaFormValidate');

        if (form.$valid) {
            $http.post($scope.mainURI + '/proccess', $scope.model).then(successCallback, generalService.errorCallback);

            function successCallback(response) {
                if(response.data.status) {
                    $rootScope.loggedUser = response.data.user;
                    redirectLoggedIn();
                }

                notificationService.flash(response.data.notification);
                notificationService.swalDestroy();
            }

            removeLastField();
        } else {
            $scope.laddaLoading = false;
        }
    };

    function checkSessionOnServer() {
        $http.post($scope.mainURI + '/check_session').then(successCallback, generalService.errorCallback);

        function successCallback(response) {
            if(response.data.status) {
                $rootScope.loggedUser = response.data.user;
                redirectLoggedIn();
            } else {
                $scope.checkingSessionOnServer =  false;
            }
        }
    }
    
    function redirectLoggedIn() {
        $location.path("/template-home/home");
        menuService.request();
    }

    function removeLastField() {
        delete $scope.model;
        $scope.model = {};
        $scope.$broadcast('schemaFormRedraw');
        $scope.laddaLoading = false;
    }
});