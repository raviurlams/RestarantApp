'use strict';

/**
 * @ngdoc service
 * @name orderistaApp.UserService
 * @description
 * # UserService
 * Factory in the orderistaApp.
 */
angular.module('orderistaApp')
  .factory('UserService', function ($resource, SERVICE_HOST) {
      var baseURL = SERVICE_HOST + '/orderista-app/users';

      return $resource(baseURL, {}, {
          login: {method:'GET', url:baseURL + '/exclude/login', isArray:false},
          updateLastAccess: {method:'PUT', url:baseURL + '/user/last-access', isArray:false},
          createUser: {method:'POST', url:baseURL + '/exclude/user', isArray:false},
          getLoggedInUserProfile: {method:'GET', url:baseURL + '/user', isArray:false},
          updateUser: {method:'PUT', url:baseURL + '/user', isArray:false},
          resetPwd:{method:'PUT', url:baseURL + '/change-password', isArray:false}
      });
  });
