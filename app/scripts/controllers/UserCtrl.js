'use strict';

/**
 * @ngdoc function
 * @name orderistaApp.controller:UserCtrl
 * @description
 * # UserCtrl
 * Controller of the orderistaApp
 */
angular.module('orderistaApp')
    .controller('UserCtrl', function($rootScope, $scope, $location, $translate, $localStorage, UserService, $uibModal, appConfiguration) {
        $scope.formSubmitted = false;
        $scope.errorMessage = null;
        $scope.message = null;
        $scope.formValid = false;
        $scope.keepSignedIn = false;
        $scope.newUserProfile = {};

        $scope.$watch('location.path()', function() {
            console.debug($location.path());
            if ($location.path() === appConfiguration.profile) {
                $scope.getLoggedInUserProfile();
            }
        }, true);

        $scope.onSignUpClick = function() {
            $location.path(appConfiguration.signUp);
        };

        $scope.openUpdatePwdDialog = function() {
            $scope.errorMessage = null;
            $scope.message = null;
            $uibModal.open({
                animation: true,
                templateUrl: 'updatePasswordModal.html',
                controller: 'updatePasswordCtrl',
                backdrop: 'static',
                keyboard: false,
                resolve: {}
            });
        };

        $scope.onSignUpSubmit = function(form) {
            $scope.errorMessage = null;
            $scope.formSubmitted = true;

            if (!form.$valid) {
                return;
            }
            $rootScope.isLoader = true;
            UserService.createUser($scope.newUserProfile, function(userProfile) {
                $rootScope.isLoggedin = true;
                $rootScope.loggedinUser = userProfile;
                $rootScope.isLoader = false;

                $location.path(appConfiguration.home);
            }, function(error) {
                $rootScope.isLoader = false;
                $scope.errorMessage = error.data.errorMessage;
            });
        };

        $scope.getLoggedInUserProfile = function() {
            $rootScope.isLoader = true;
            UserService.getLoggedInUserProfile({}, function(userProfile) {
                $scope.userProfile = userProfile;
                $rootScope.isLoader = false;
            }, function(error) {
                $rootScope.isLoader = false;
                $scope.errorMessage = error.data.errorMessage;
            });
        };

        $scope.onUpdateProfileClick = function(form) {
            $scope.formSubmitted = true;
            $scope.errorMessage = null;
            $scope.message = null;

            if (!form.$valid) {
                return;
            }
            $rootScope.isLoader = true;
            UserService.updateUser($scope.userProfile, function() {
                $scope.errorMessage = null;
                $scope.message = $translate.instant('MSG-Updated-Successfully');
                $rootScope.isLoader = false;
            }, function(error) {
                $scope.message = '';
                $scope.errorMessage = error.data.errorMessage;
                $rootScope.isLoader = false;
            });
        };

        $scope.onLoginClick = function(form) {
            $scope.errorMessage = null;
            $scope.formSubmitted = true;
            $rootScope.isLoggedin = false;
            $rootScope.userProfile = null;

            if (!form.$valid) {
                return;
            }

            $rootScope.basicAuthToken = btoa($scope.emailID + ':' + $scope.password);
            $rootScope.isLoader = true;
            UserService.login({}, function(userProfile) {
                $rootScope.isLoggedin = true;
                $rootScope.loggedinUser = userProfile;

                if ($scope.keepSignedIn === true) {
                    $localStorage.loggedinUser = userProfile;
                }
                $rootScope.isLoader = false;
                $location.path(appConfiguration.home);
            }, function(error) {
                if (error.status === 401) {
                    $scope.errorMessage = $translate.instant('INVALID-CREDENTIALS');
                } else {
                    $scope.errorMessage = $translate.instant('OOPS-MSG');
                }
                $rootScope.isLoader = false;
            });
        };
       
    }).controller('updatePasswordCtrl', function($scope, $rootScope, $translate, UserService, $uibModalInstance) {
        var vm = $scope;
        // Variables
        vm.updatePwdInfo = {};
        vm.message = '';
        vm.showSuccessMsg = false;
        vm.isInvalidPwd = false;
        vm.isSuccessPwd = false;

        //////// Functions Implementations ////
        // if both Current and New is Same pwd 
        vm.validForm = function(form) {
            vm.isInvalidPwd = false;
            vm.isSuccessPwd = false;
            vm.message = '';
            if (form && form.$valid && vm.updatePwdInfo.userPassword === vm.updatePwdInfo.newpasswordStr) {
                vm.isInvalidPwd = true;
                vm.message = $translate.instant('PASSWORD-MISMATCH');
                return false;
            }
            return true;
        };

        vm.updateNewPassword = function(form) {
            vm.isInvalidPwd = false;
            vm.isSuccessPwd = false;
            vm.message = '';
            if (form.$valid && vm.validForm(form)) {
                var reqObj = {};
                reqObj.currentPasswordOrToken = vm.updatePwdInfo.userPassword;
                reqObj.password = vm.updatePwdInfo.newpasswordStr;
                $rootScope.isLoader = true;
                UserService.resetPwd(reqObj, function() {
                    vm.isSuccessPwd = true;
                    $rootScope.isLoader = false;
                    vm.message = $translate.instant('MSG-Updated-Successfully');
                }, function(error) {
                    vm.message = null;
                    vm.isInvalidPwd = true;
                    vm.isSuccessPwd = false;
                    vm.message = error.data.errorMessage;
                    $rootScope.isLoader = false;
                });
            }
        };

        vm.cancel = function() {
            vm.isInvalidPwd = false;
            vm.isSuccessPwd = false;
            $uibModalInstance.dismiss('cancel');
        };
    });
