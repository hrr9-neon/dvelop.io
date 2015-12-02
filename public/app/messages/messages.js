angular.module('dvelop.messages', ['dvelop.auth'])

.controller('MessagesController', function ($scope, logout, $location, $firebaseArray, $firebaseObject, UserStore){

  var messages = this;

  search.users = $firebaseArray(new Firebase("https://shining-torch-3159.firebaseio.com/users"));
    //it is possible that you call object as an array using $firebaseArray;



  //logout func
  search.logout = logout.logout;

})
