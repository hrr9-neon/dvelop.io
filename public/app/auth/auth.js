/*NOTE: Authorization data is imported from Github and stored in local storage (userStore) in order to
populate user profile with Github profile picture, name, and basic information. For improvement, save data to DB when
it is imported from Github.
*/

angular.module('dvelop.auth', [])

.factory('Auth', function($firebaseAuth){
  var usersRef = new Firebase("https://shining-torch-3159.firebaseio.com");
  return $firebaseAuth(usersRef);
})

.controller('AuthController', function($scope, Auth, $location, $rootScope, $firebase, $firebaseObject, Users){

  $rootScope.fb = new Firebase("https://shining-torch-3159.firebaseio.com");
  $rootScope.loggedIn = null;

  $scope.login = function() {
    Auth.$authWithOAuthPopup("github")
      //this needs work...
    .then(function(authData){
      if ($rootScope.loggedIn) {
        console.log('setting loggedIn for defined $rootScope.loggedIn', $rootScope.loggedIn.userID);
        Users.setOnline($rootScope.loggedIn.userID);
        $location.path('/search');
      } else {
        $rootScope.loggedIn = {
          userID: authData.github.id,
          displayName: authData.github.displayName,
          email: authData.github.email,
          imageURL: authData.github.profileImageURL
        };
        console.log('setting loggedIn for undefined $rootScope.loggedIn', $rootScope.loggedIn.userID);
        Users.setOnline($rootScope.loggedIn.userID);
        // var ref = new Firebase("https://shining-torch-3159.firebaseio.com/users/" + $rootScope.loggedIn.userID);
        // var refObj = $firebaseObject(ref);
        // if (refObj.hasOwnProperty('displayName')) {
        //   $location.path('/search');
        // } else {
        $location.path('/signup');
        // }
      }
    });
  };

  $scope.signup = function() {
    console.log('signup button clicked');
    $location.path('/signup');
  };

})

.factory('logout', function(Auth, $rootScope, $location, $firebaseObject){
  //todo: this is hard coded, needs to be part of config or $rootScope
  //var FirebaseUrl = "https://shining-torch-3159.firebaseio.com/";
  //var usersRef = new Firebase(FirebaseUrl+'users');
  var logoutFn = function(){
    var FirebaseUrl = "https://shining-torch-3159.firebaseio.com/";
    var uid = $rootScope.loggedIn.userID
    Auth.$unauth();
    delete $rootScope.loggedIn;
    var ref = new Firebase("https://shining-torch-3159.firebaseio.com/users/");
    var usersRef = ref.child(uid+'/online');
    var lastOnlineRef = ref.child(uid+'/lastonline');
    var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
    var connected = $firebaseObject(connectedRef);
    connected.$watch(function() {
      if(connected.$value === true) {
        usersRef.set(false);
        lastOnlineRef.set(Firebase.ServerValue.TIMESTAMP);
      }
    });
    $location.path('/auth');

  };
  return { logout: logoutFn };
})

.factory('Users', function($firebaseArray, $firebaseObject) {
  //todo: this is hard coded, needs to be part of config or $rootScope
  var FirebaseUrl = "https://shining-torch-3159.firebaseio.com/";
  var usersRef = new Firebase(FirebaseUrl+'users');
  var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
  var users = $firebaseArray(usersRef);

  var Users = {
    // getProfile: function(uid) {
    //   return $firebaseObject(usersRef.child(uid));
    // },

    // getDisplayName: function(uid) {
    //   return users.$getRecord(uid).displayName;
    // },

    // getGravatar: function(uid) {
    //   return '//www.gravatar.com/avatar/' + users.$getRecord(uid).emailHash;
    // },

    setOnline: function(uid) {
      var ref = new Firebase("https://shining-torch-3159.firebaseio.com/users/");
      var usersRef = ref.child(uid+'/online');
      var lastOnlineRef = ref.child(uid+'/lastonline');
      var connected = $firebaseObject(connectedRef);
      //var online = $firebaseArray(usersRef.child(uid+'/online'));

      connected.$watch(function() {
        if(connected.$value === true) {
          usersRef.set(true);
          lastOnlineRef.set('now');
        }
      });
    },

    all: users
  };

  return Users;
})
