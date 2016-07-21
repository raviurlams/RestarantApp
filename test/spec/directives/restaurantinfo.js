'use strict';

describe('Directive: restaurantInfo', function () {

  // load the directive's module
  beforeEach(module('orderistaApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<restaurant-info></restaurant-info>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the restaurantInfo directive');
  }));
});
