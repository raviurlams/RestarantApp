'use strict';

/**
 * @ngdoc overview
 * @name orderistaApp
 * @description
 * # orderistaApp
 *
 * Main module of the application.
 */
var orderistaApp = angular.module('orderistaApp', ['ngResource',
    'ngRoute',
    'toggle-switch',
    'ngStorage',
    'ngSanitize',
    'ngTouch',
    'ngCookies',
    'pascalprecht.translate',
    'ngMessages',
    'ui.bootstrap',
    'tmh.dynamicLocale',
    'google.places'
]);


//orderistaApp.constant('SERVICE_HOST', 'http://localhost:8090');
orderistaApp.constant('SERVICE_HOST', 'http://qa.orderista.com');

orderistaApp.config(function myConfigFn($routeProvider, $translateProvider,tmhDynamicLocaleProvider, $compileProvider, $httpProvider, appConfiguration) {
    $translateProvider.useSanitizeValueStrategy('sanitize');
    // Localization  Support
    $translateProvider.useMissingTranslationHandlerLog();
    $translateProvider.useStaticFilesLoader({
        prefix: appConfiguration.langFilePath,
        suffix: '.json'
    });
    $translateProvider.preferredLanguage(appConfiguration.preferredLocale);
    $translateProvider.useLocalStorage();
    // Remving ng-scope class in All HTML page  - it Increase the Page speed
    $compileProvider.debugInfoEnabled(appConfiguration.debugmode);
    $httpProvider.useApplyAsync(true);
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');

    // interceptors
    $httpProvider.interceptors.push('authInterceptor');

    // Router's
    $routeProvider
        .when(appConfiguration.basePath, {
            templateUrl: 'views/LandingPage.html',
            controller: 'UserCtrl'
        })
        .when(appConfiguration.signUp, {
            templateUrl: 'views/SignUp.html',
            controller: 'UserCtrl'
        })
        .when(appConfiguration.profile, {
            templateUrl: 'views/UserProfile.html',
            controller: 'UserCtrl'
        })
        .when(appConfiguration.home, {
            templateUrl: 'views/HomePage.html',
            controller: 'RestaurantCtrl'
        })
        .when(appConfiguration.setupNewRestaurant, {
            templateUrl: 'views/NewRestaurantSetup.html',
            controller: 'RestaurantCtrl'
        })
        .when(appConfiguration.manageRestaurant, {
            templateUrl: 'views/ManageRestaurant.html',
            controller: 'RestaurantCtrl'
        }).otherwise({
            redirectTo: appConfiguration.basePath
        });

});
orderistaApp.factory('authInterceptor', function($rootScope, $q) {
    return {
        request: function(config) {
            config.headers = config.headers || {};

            if (config.url.indexOf('/orderista-app/users/exclude/login') !== -1) {
                config.headers.Authorization = 'Basic ' + $rootScope.basicAuthToken;
            } else if (config.url.indexOf('/orderista-app/') !== -1) {
                if ($rootScope.loggedinUser !== undefined && $rootScope.loggedinUser !== null) {
                    config.headers.Authorization = 'Bearer ' + $rootScope.loggedinUser.authToken;
                }
            }

            return config;
        },
        response: function(response) {
            return response || $q.when(response);
        },

        responseError: function(error) {
            return $q.reject(error);
        }
    };
});
/* Filters */
orderistaApp.filter('iif', function() {
    return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
    };
});

orderistaApp.run(function($rootScope,$translate) {
    $rootScope.isLoader = false;
    $rootScope.restaurantCurrentTabIndex = 1;
    $rootScope.restaurantCurrentTab = $translate.instant('favorites');
    $rootScope.entitledRestaurants = [];
});
