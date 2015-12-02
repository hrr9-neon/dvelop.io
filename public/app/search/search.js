//NOTE - for testing purposes, the code starting at line 37 generates random users for mock data
//The "in-memory" test version has been commented out, the app is curently correctly using the Firebase DB

angular.module('dvelop.search', ['dvelop.auth'])

.controller('SearchController', function (currentAuth, $scope, logout, $location, $firebaseArray, $firebaseObject){

  var search = this;

  search.input = ''

  // DB version : retrieving the data from DB.
  search.users = $firebaseArray(new Firebase("https://shining-torch-3159.firebaseio.com/users"));
  //it is possible that you call object as an array using $firebaseArray;

  // search.users = $firebaseObject(new Firebase("https://shining-torch-3159.firebaseio.com/users")); //object version
  // console.log('usersinDB:',search.users);

  //logout func
  search.logout = logout.logout;

})

