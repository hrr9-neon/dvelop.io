/*NOTE: Authorization data is imported from Github and stored in local storage (userStore) in order to
populate user profile with Github profile picture, name, and basic information. For improvement, save data to DB when
it is imported from Github.
*/

angular.module('dvelop.auth', [])

.factory('Auth', function($firebaseAuth){
  var usersRef = new Firebase("https://shining-torch-3159.firebaseio.com");
  return $firebaseAuth(usersRef);
})

.controller('AuthController', function($scope, Auth, $location, $rootScope, $firebase){

  $rootScope.fb = new Firebase("https://shining-torch-3159.firebaseio.com");
  $rootScope.loggedIn = null;

  $scope.login = function() {
    Auth.$authWithOAuthPopup("github")
      //this needs work...
    .then(function(authData){
      if ($rootScope.loggedIn) {
        $location.path('/search');
      } else{
        $rootScope.loggedIn = {
          userID: authData.github.id,
          displayName: authData.github.displayName,
          email: authData.github.email,
          imageURL: authData.github.profileImageURL
        };
        $location.path('/search');
      }
    });
  };

  $scope.signup = function() {
    console.log('signup button clicked');
    $location.path('/signup');
  };

})

.factory('logout', function(Auth, $rootScope, $location){
    var logoutFn = function(){
      Auth.$unauth();
      delete $rootScope.loggedIn;
      $location.path('/auth');

    };
    return { logout: logoutFn };
});
