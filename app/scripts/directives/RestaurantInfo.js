'use strict';

/**
 * @ngdoc directive
 * @name orderistaApp.directive:restaurantInfo
 * @description
 * # restaurantInfo
 */
angular.module('orderistaApp')
  .directive('restaurantInfo', function () {
    return {
        templateUrl: 'views/RestaurantInfo.html',
        restrict: 'A',
        scope: {
            restaurantInfo: '=',
            onSelect: '&'
        }
    };
  });
