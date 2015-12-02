angular.module('dvelop.signup', ['dvelop.auth'])

.controller('SignupController', function(currentAuth, $scope, Auth, $location, $rootScope, $firebaseObject){

  $scope.user = {};
  $scope.currentUser;

  var userData = new Firebase("https://shining-torch-3159.firebaseio.com/users/" + $rootScope.loggedIn.userID);

  userData.on('value', function(snapshot){
    console.log(snapshot.val());
    $scope.currentUser = (snapshot.val());
    $scope.user.displayName = $scope.currentUser.displayName;
    $scope.user.emailAddress = $scope.currentUser.email;
    // $scope.user.birthday = $scope.currentUser.birthday;
    $scope.user.professionalLevel = $scope.currentUser.prefessionalLevel;
    $scope.user.profileImageUrl = $scope.currentUser.profileImageUrl;
    $scope.user.address = $scope.currentUser.address;
    $scope.user.bestAt = $scope.currentUser.bestAt;
    $scope.user.helpAvail = $scope.currentUser.helpAvail;
    $scope.user.job = $scope.currentUser.job;
    $scope.user.mentorAvail = $scope.currentUser.mentorAvail;
  });

  $scope.saveData = function(){
    var userRef = new Firebase("https://shining-torch-3159.firebaseio.com/users");
    userRef.child($scope.authData.github.id).update($scope.user);
    $location.path('/search'); //object version
  };

});
