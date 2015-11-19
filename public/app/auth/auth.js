angular.module('dvelop.auth', [])

.factory('Auth', function($firebaseAuth){
	var usersRef = new Firebase("https://amber-inferno-2562.firebaseio.com");
	return $firebaseAuth(usersRef);
})

.factory('UsersRef', function(){
	var usersRef = new Firebase("https://amber-inferno-2562.firebaseio.com/");
	return usersRef;
})

.factory('UserStore', function(){
	var userStore = {};
	return userStore;
})

.controller('AuthController', function($scope, Auth, $location, UsersRef, UserStore){
	Auth.$onAuth(function(authData){
		$scope.authData = authData;

		if (authData === null){
			console.log('User is not logged in yet.');
		} else {
			console.log('User logged in as ', authData);
			$location.path('/search')
		}
	})

	$scope.login = function(){
		Auth.$authWithOAuthPopup("github")
			.then(function(authData){
				if (UserStore[authData.github.id]){
					$location.path('/search');
				} else{	
					UserStore[authData.github.id] = {
						userID: authData.github.id,
						displayName: authData.github.displayName,
						email: authData.github.email,
						imageURL: authData.github.profileImageURL
					}
				}
				console.log(UserStore); 
				$location.path('/signup');


				//console.log(authData.github.id);
				//console.log(authData.github.displayName);
				//console.log(authData.github.profileImageURL);


			})
			
	}
})

.factory('logout', function(Auth, $location){
		var logoutFn = function(){
			Auth.$unauth();	
			$location.path('/auth')
			console.log('This was fired!');
		}
		return {logout: logoutFn};
})

.factory('')



//Firebase Authorization Factory

//Controller, you need authentication

	//$scope login

		//auth.authwithonauthpopup



//Create Template for Signup with Github
	//Navbar
	//Button
	//Github Icon

//Register app with Github
	//GH Client ID
	//GH Client Secret

//Link between github and our application
	//Check on our application's access to use Github Auth
	//Check to see if signed in to Github
	//If not, check to see if they are signed up with Github
	//Authorization takes place
	//Assign user a JWT

//If Github Username is not in DB
	//Send to Dvelop signup page
//If in DB, start new session and send to community page



