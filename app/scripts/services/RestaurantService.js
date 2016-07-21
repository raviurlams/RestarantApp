'use strict';

/**
 * @ngdoc service
 * @name orderistaApp.RestaurantService
 * @description
 * # RestaurantService
 * Factory in the orderistaApp.
 */
angular.module('orderistaApp')
  .factory('RestaurantService', function ($resource, SERVICE_HOST) {
      var baseURL = SERVICE_HOST + '/orderista-app/restaurants';

      return $resource(baseURL, {}, {
          getEntitledRestaurants: {method:'GET', url:baseURL + '/entitled-restaurants', isArray:true},
          createRestaurant: {method: 'POST', url:baseURL + '/orderista-admin/restaurant', isArray:false},
          getRestaurantDetail: {method:'GET', url:baseURL + '/restaurant-admin/restaurant-detail', isArray:false}
      });
  });
