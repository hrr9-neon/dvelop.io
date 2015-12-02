angular.module('dvelop.messages', ['dvelop.auth'])
.factory('rooms', function($firebase, $rootscope) {

})

.controller('MessagesController', function ($scope, logout, $location, $firebaseArray, $firebaseObject, $rootScope){


  $scope.publicrooms = [];
  $scope.privaterooms = [];

  var myRoomList = [];

  var myRooms = new Firebase("https://shining-torch-3159.firebaseio.com/users/" + $rootScope.loggedIn.userID + '/rooms');

  var checkRooms = function() {
    myRooms.on('child_added', function(snapshot){
      console.log(snapshot.val());
      console.log(snapshot.key());

      var roomID = snapshot.key();

      var roomInfo = new Firebase("https://shining-torch-3159.firebaseio.com/rooms/" + roomID);

      roomInfo.once('value', function(item) {
        var roomDetail = item.val();
        console.log(roomDetail);
        if (roomDetail.type === 'public') {
          $scope.privaterooms.push({
            id: roomID,
            name: roomDetail.name
          });
        }
      });
    });

  };


  checkRooms();
  // // List the names of all Mary's groups
  // var ref = new Firebase("https://shining-torch-3159.firebaseio.com");

  // // fetch a list of Mary's groups
  // ref.child("users/" + $rootScope.loggedIn.userID + "/rooms").on('child_added', function(snapshot) {
  //   // for each group, fetch the name and print it
  //   var roomKey = snapshot.key();
  //   ref.child("rooms/" + roomKey + "/name").once('value', function(snapshot) {
  //     System.out.println("Mary is a member of this group: " + snapshot.val());
  //   });
  // });



  // var myRooms = $firebaseArray(new Firebase("https://shining-torch-3159.firebaseio.com/users/" + $rootScope.loggedIn.userID + '/rooms'));



  // console.log(data.publicrooms);

  //logout func
  $scope.logout = logout.logout;

});
