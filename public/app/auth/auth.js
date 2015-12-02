/*NOTE: Authorization data is imported from Github and stored in local storage (userStore) in order to
populate user profile with Github profile picture, name, and basic information. For improvement, save data to DB when
it is imported from Github.
*/

angular.module('dvelop.auth', [])

.factory('Auth', function($firebaseAuth){
	var usersRef = new Firebase("https://shining-torch-3159.firebaseio.com");
	return $firebaseAuth(usersRef);
})

.factory('UsersRef', function(){
	var usersRef = new Firebase("https://shining-torch-3159.firebaseio.com/");
	return usersRef;
})

.factory('UserStore', function(){
	var userStore = {};
	return userStore;
})

.controller('AuthController', function($scope, Auth, $location, UsersRef, UserStore, $rootScope, $firebase){
	Auth.$onAuth(function(authData){
		$scope.authData = authData;

		if (authData === null){
			console.log('User is not logged in yet.');
		} else {
			console.log('User logged in as ', authData);
			$location.path('/search');
		}
	});
	$rootScope.fb = new Firebase("https://shining-torch-3159.firebaseio.com");
	$rootScope.loggedIn = null;
	$scope.login = function(){
		Auth.$authWithOAuthPopup("github")
			//this needs work...
			.then(function(authData){
				if ($rootScope.loggedIn){
					$location.path('/search');
				} else{
					$rootScope.loggedIn = {
						userID: authData.github.id,
						displayName: authData.github.displayName,
						email: authData.github.email,
						imageURL: authData.github.profileImageURL
					};
					
				}
				// console.log(UserStore);
				console.log($rootScope.loggedIn);
				$location.path('/signup');
				$rootScope.test = 'Ahmet';
			});
	};

	$scope.signup = function(){
		console.log('signup button clicked');
		$location.path('/signup');
	};
})

.factory('logout', function(Auth, $location){
		var logoutFn = function(){
			Auth.$unauth();
			$location.path('/auth');
			console.log('This was fired!');
		};
		return { logout: logoutFn };
});
