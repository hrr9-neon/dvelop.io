angular.module('dvelop.signup', ['dvelop.auth'])

.controller('SignupController', function(logout, currentAuth, $scope, Auth, $location, $rootScope, $firebaseObject){

  $scope.user = {};
  $scope.user.profileImageUrl = $rootScope.loggedIn.imageURL

  var userData = $rootScope.fb.child('users/' + $rootScope.loggedIn.userID);

  userData.on('value', function(snapshot){
    $scope.currentUser = (snapshot.val());
    $scope.user.displayName = $scope.currentUser.displayName;
    $scope.user.emailAddress = $scope.currentUser.emailAddress;
    // $scope.user.birthday = $scope.currentUser.birthday;
    $scope.user.professionalLevel = $scope.currentUser.professionalLevel;
    //$scope.user.profileImageUrl = $rootScope.loggedIn.imageURL;
    $scope.user.address = $scope.currentUser.address;
    $scope.user.bestAt = $scope.currentUser.bestAt;
    $scope.user.techSkill = $scope.currentUser.techSkill;
    $scope.user.helpAvail = $scope.currentUser.helpAvail;
    $scope.user.job = $scope.currentUser.job;
    $scope.user.mentorAvail = $scope.currentUser.mentorAvail;
  });

  $scope.saveData = function(){
    var objectToSave = {};
    for (key in $scope.user) {
      var value = $scope.user[key];
      if (value !== undefined && value !== null) {
        objectToSave[key] = value;
      }
    }
    var userRef = $rootScope.fb.child('users');
    userRef.child($rootScope.loggedIn.userID).set(objectToSave);
    //userRef.child($rootScope.loggedIn.userID).set($scope.user);
    $location.path('/search'); //object version
  };

  $scope.logout = logout.logout;

});
