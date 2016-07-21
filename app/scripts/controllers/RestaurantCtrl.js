'use strict';

angular.module('orderistaApp')
    .controller('RestaurantCtrl', function($rootScope, $scope, $translate, $location, appConfiguration, RestaurantService) {
        $scope.manageRestCurrentTab = $translate.instant('detail');
        $scope.restaurantSetupFormValid = false;
        $scope.restaurantManageTabIndex = 1;
        $scope.googlePlace = null;
        $scope.restaurantDetail = {};
        $scope.restaurantDetail.tableService = true;
        $scope.restaurantDetail.orderistaEnabled = true;
        $scope.isRestaurantMsg = false;
        $scope.isInvalidRestaurant = false;
        $scope.message = null;

        $scope.$watch('location.path()', function() {
            if ($location.path() === appConfiguration.manageRestaurant) {
                $scope.restManageCurrentTab = $translate.instant('detail');
                $scope.getRestaurantDetail($rootScope.selectedRestaurant);
            }
        }, true);

        $scope.onRestaurantFinderToggle = function(selectedTabIndex) {
            $rootScope.restaurantCurrentTabIndex = selectedTabIndex;

            if (selectedTabIndex === 1) {
                $rootScope.restaurantCurrentTab = $translate.instant('favorites');
            } else if (selectedTabIndex === 2) {
                $rootScope.restaurantCurrentTab = $translate.instant('NEAR-BY');
            } else if (selectedTabIndex === 3) {
                $rootScope.restaurantCurrentTab = $translate.instant('Manage');
            }

            if ($rootScope.restaurantCurrentTab === $translate.instant('Manage')) {
                $scope.getEntitledRestaurant();
            }
        };

        $scope.onRestaurantManageToggle = function(selectedTabIndex) {
            $scope.restaurantManageTabIndex = selectedTabIndex;

            if (selectedTabIndex === 1) {
                $scope.restManageCurrentTab = $translate.instant('detail');
            } else if (selectedTabIndex === 2) {
                $scope.restManageCurrentTab = $translate.instant('Users');
            } else if (selectedTabIndex === 3) {
                $scope.restManageCurrentTab = $translate.instant('Menu');
            }

            if (selectedTabIndex === 1) {
                $scope.getRestaurantDetail($rootScope.selectedRestaurant);
            }
        };


        $scope.getEntitledRestaurant = function() {
            $rootScope.isLoader = true;
            RestaurantService.getEntitledRestaurants({}, function(entitledRestaurants) {
                $rootScope.entitledRestaurants = entitledRestaurants;
                $rootScope.isLoader = false;
            }, function(error) {
                $rootScope.isLoader = false;
                $scope.message = error.data.errorMessage;
            });
        };

        $scope.onSetupNewRestaurantClick = function() {
            $location.path(appConfiguration.setupNewRestaurant);
        };

        function isNullOrEmpty(obj) {
            return (angular.isUndefined(obj) || obj === null || obj === 'null' || typeof obj === 'undefined' || obj === '');
        }
        $scope.isValidGoogleAddress = function(form) {
            form.address.$setValidity('pattern', true);
            var placeValue = form.address.$modelValue;
            if (isNullOrEmpty(placeValue)) {
                form.address.$setValidity('pattern', false);
            }
        };
        $scope.onSaveRestaurantClick = function(form) {
            $scope.restaurantSetupSubmitted = true;
            $scope.isRestaurantMsg = false;
            $scope.isInvalidRestaurant = false;

            if (!form.$valid) {
                return;
            }
            var googlePlace = $scope.googlePlace;

            if (googlePlace !== null) {
                $scope.restaurantDetail.googlePlacesID = googlePlace.place_id;
                $scope.restaurantDetail.address = googlePlace.formatted_address;
                $scope.restaurantDetail.latitude = googlePlace.geometry.location.lat();
                $scope.restaurantDetail.longitude = googlePlace.geometry.location.lng();
            }

            $rootScope.isLoader = true;
            RestaurantService.createRestaurant($scope.restaurantDetail, function() {
                $scope.isRestaurantMsg = true;
                $rootScope.isLoader = false;
                $scope.message = $translate.instant('MSG-Created-Successfully');
                $rootScope.restaurantCurrentTab = $translate.instant('Manage');
                $scope.onRestaurantFinderToggle(3);
                $location.path(appConfiguration.home);
            }, function(error) {
                $rootScope.isLoader = false;
                $scope.isInvalidRestaurant = true;
                $scope.message = error.data.errorMessage;
            });
        };

        $scope.onRestaurantSelect = function(restaurantID) {
            $rootScope.selectedRestaurant = restaurantID;
            $location.path(appConfiguration.manageRestaurant);
        };


        $scope.getRestaurantDetail = function(restaurantID) {
            $rootScope.isLoader = true;
            RestaurantService.getRestaurantDetail({ 'restaurantID': restaurantID }, function(restaurantDetail) {
                $scope.restaurantDetail = restaurantDetail;
                $scope.googlePlace = restaurantDetail.address;

                $rootScope.isLoader = false;
            }, function() {
                $rootScope.isLoader = false;
            });
        };

        $scope.$watch('restaurantDetail.tableService', function(n, o) {
            if (n !== o && n === false) {
                $scope.restaurantDetail.tableReservation = false;
            }
        }, true);

    });
