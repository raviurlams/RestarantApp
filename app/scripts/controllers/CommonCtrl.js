'use strict';

/**
 * @ngdoc function
 * @name orderistaApp.controller:CommonCtrl
 * @description
 * # CommonCtrl
 * Controller of the orderistaApp
 */
angular.module('orderistaApp')
    .controller('CommonCtrl', function($rootScope, $scope, $translate, $localStorage, $location, appConfiguration, UserService) {
        $scope.initApp = function() {
            if ($localStorage.loggedinUser !== undefined && $localStorage.loggedinUser !== null) {
                console.debug('Login stored previously');

                $rootScope.isLoggedin = true;
                $rootScope.loggedinUser = $localStorage.loggedinUser;

                UserService.updateLastAccess({});

                if ($location.path() === '/' || $location.path() === '') {
                    $location.path(appConfiguration.home);
                }
            } else {
                $rootScope.isLoggedin = false;
                $rootScope.userProfile = null;
                $location.path(appConfiguration.basePath);
            }
        };

        $scope.initApp();

        $scope.signOut = function() {
            $localStorage.loggedinUser = null;

            $rootScope.isLoggedin = false;
            $rootScope.loggedinUser = null;

            $location.path(appConfiguration.basePath);
        };

    });
