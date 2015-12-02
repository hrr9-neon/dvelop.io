angular.module('dvelop.signup', ['dvelop.auth'])

.controller('SignupController', function(logout, currentAuth, $scope, Auth, $location, $rootScope, $firebaseObject){

  $scope.user = {};
  $scope.currentUser;

  var userData = $rootScope.fb.child('users/' + $rootScope.loggedIn.userID);

  userData.on('value', function(snapshot){
    console.log(snapshot.val());
    console.log(snapshot.key());
    $scope.currentUser = (snapshot.val());
    $scope.user.displayName = $scope.currentUser.displayName;
    $scope.user.emailAddress = $scope.currentUser.emailAddress;
    // $scope.user.birthday = $scope.currentUser.birthday;
    $scope.user.professionalLevel = $scope.currentUser.professionalLevel;
    $scope.user.profileImageUrl = $scope.currentUser.profileImageUrl;
    $scope.user.address = $scope.currentUser.address;
    $scope.user.bestAt = $scope.currentUser.bestAt;
    $scope.user.helpAvail = $scope.currentUser.helpAvail;
    $scope.user.job = $scope.currentUser.job;
    $scope.user.mentorAvail = $scope.currentUser.mentorAvail;

    // $scope.dataHasLoaded = true;
  });

  $scope.saveData = function(){
    var userRef = $rootScope.fb.child('users');
    userRef.child($rootScope.loggedIn.userID).update($scope.user);
    $location.path('/search'); //object version
  };

  $scope.logout = logout.logout;

});
