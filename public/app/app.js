angular.module('dvelop', [
  'dvelop.auth',
  'firebase',
  'dvelop.search',
  'dvelop.signup',
  'ngRoute'
])

.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireAuth promise is rejected
    // and redirect the user back to the home page
    if (error === "AUTH_REQUIRED") {
      $location.path("/home");
    }
  });
}])


.config(function($routeProvider) {
  $routeProvider
    .when('/auth', {
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    })
    .when('/signup', {
      templateUrl: 'app/signup/signup.html',
      controller: 'SignupController',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper (factory in auth.js)
        "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })
    .when('/search', {
      templateUrl: 'app/search/search.html',
      controller: 'SearchController as search',
      resolve: {
        // controller will not be loaded until $requireAuth resolves
        // Auth refers to our $firebaseAuth wrapper (factory in auth.js)
        "currentAuth": ["Auth", function(Auth) {
          // $requireAuth returns a promise so the resolve waits for it to complete
          // If the promise is rejected, it will throw a $stateChangeError (see above)
          return Auth.$requireAuth();
        }]
      }
    })
    .otherwise({
      templateUrl: 'app/auth/auth.html',
      controller: 'AuthController'
    });

});