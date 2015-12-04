angular.module('dvelop.signup', ['dvelop.auth'])

.controller('SignupController', function(logout, currentAuth, $scope, Auth, $location, $rootScope, $firebaseObject){

  $scope.user = {};
  $scope.user.profileImageUrl = $rootScope.loggedIn.imageURL;
  $scope.user.rooms = {'3c738eedf4084011808f288d2497c481': "General"};

  // var ref = new Firebase("https://shining-torch-3159.firebaseio.com/users/");
  // var uid = $rootScope.loggedIn.userID;
  // var usersRef = ref.child(uid+'/online');
  // var lastOnlineRef = ref.child(uid+'/lastonline');
  // var FirebaseUrl = "https://shining-torch-3159.firebaseio.com/";
  // var connectedRef = new Firebase(FirebaseUrl+'.info/connected');
  // var connected = $firebaseObject(connectedRef);
  // connected.$watch(function() {
  //   if(connected.$value === true) {
  //     usersRef.set(true);
  //     lastOnlineRef.set('now');
  //   }
  // });

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
    $scope.user.lastonline = $scope.currentUser.lastonline;
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
    userRef.child($rootScope.loggedIn.userID).update(objectToSave);
    var memberRef = $rootScope.fb.child('membership');
    //var membershipToSave = {$rootScope.loggedIn.userID: objectToSave.displayName};
    memberRef.child('3c738eedf4084011808f288d2497c481').child($rootScope.loggedIn.userID).set(objectToSave.displayName);
    //memberRef.update();
    //userRef.child($rootScope.loggedIn.userID).set($scope.user);
    $location.path('/search'); //object version
  };

  $scope.logout = logout.logout;

});
