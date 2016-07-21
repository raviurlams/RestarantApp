(function() {
    'use strict';
    angular.module('orderistaApp').constant('appConfiguration', {
        basePath: '/',       
        langFilePath: '/resources/locale-',
        locales: {
            'fr_FR': 'French',
            'en_US': 'English'
        },
        preferredLocale: 'en_US',
        debugmode: false,
        signUp: '/signUp',
        profile: '/profile',
        home: '/home',
        setupNewRestaurant: '/setup-new-restaurant',
        manageRestaurant: '/manage-restaurant'
    });
})();
