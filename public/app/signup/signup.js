// angular.module('dvelop.signup', ['dvelop.auth'])

// .factory('Profile', function(){
// 	var userProfile = 
// });
// .controller('SignupController', function($scope, UserStore){
// 	var signup = this;
// 	signup.authdata = UserStore;
// 	var key = Object.keys(signup.authdata);
// 	var name = signup.authdata[key].displayName;
// 	var email = signup.authdata[key].email;
// 	var picture = signup.authdata[key].imageURL;
// 	$scope.name = name; console.log(signup.authdata);
// 	console.log(name);
// 	$scope.username = {title: name};
// 	$scope.email = {title: email};
// 	$scope.picture = {title: picture};
// 	console.log(picture);
// 	//$scope.widget = {title:'abc'};

// 	console.log(UserStore);
// 	$scope.saveData = function(){

// 	}

// });

angular.module('dvelop.signup', ['dvelop.auth'])

.controller('SignupController', function($scope, UserStore, Auth, $location){
 var signup = this;
 signup.authdata = UserStore;

 $scope.user = {};
 $scope.currentUser;
 //get all values from the form
 //store the data in UserStore
 //push it to the firebase DB.

 Auth.$onAuth(function(authData){
 	$scope.authData = authData;
 	$scope.currentUser = UserStore[$scope.authData.github.id];
 	console.log($scope.currentUser);
 	// UserStore[$scope.authData.github.id] = {
 	// address: $scope.address,
 	// bestAt: ,
 	// displayName: ,
 	// emailAddress: ,
 	// helpAvail: ,
 	// job:, 
 	// mentorAvail: ,
 	// professionalLevel: ,
 	// profileImageUrl: ,
 	// techSkill: 

 	// };

 var name = $scope.currentUser.displayName;
 console.log(name);

 $scope.user.displayName = $scope.currentUser.displayName;
 $scope.user.emailAddress = $scope.currentUser.email;
 $scope.user.birthday = "";
 $scope.user.professionalLevel = "";
 $scope.user.profileImageUrl = $scope.currentUser.imageURL;
 console.log($scope.user.profileImageUrl);
 $scope.user.address = '';
 $scope.user.bestAt = '';
 $scope.user.helpAvail = true;
 $scope.user.job = '';
 $scope.user.mentorAvail = true;
 // $scope.username = {title: name};
 // $scope.email = {title: email};
 // $scope.picture = {title: picture};
 //console.log(picture);
 //$scope.widget = {title:'abc'};
 })

 // // var currentUser = Object.keys(signup.authdata);
 // var email = $scope.currentUser.email;
 // var picture = $scope.currentUser.imageURL;

 // $scope.user.name = $scope.currentUser.displayName;
$scope.saveData = function(){
	var userRef = new Firebase("https://amber-inferno-2562.firebaseio.com/users"); 
	userRef.child($scope.authData.github.id).update($scope.user);
	$location.path('/search'); //object version
	console.log('saveData fired!',$scope.user);
}

});






