angular.module('dvelop', [
  'dvelop.auth',
  'firebase',
  'dvelop.search',
  'dvelop.signup',
  'ngRoute'
])

.config(function($routeProvider) {
  $routeProvider
    .when('/auth', {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/signup/signup.html',
      controller: 'SignupController'
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController as search'
    })
    .otherwise({
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    });

});