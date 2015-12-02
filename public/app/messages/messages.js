angular.module('dvelop.messages', [])

.factory('MyRooms', function($rootScope, $firebase) {
  var myRooms = $rootScope.fb.child('users/' + $rootScope.loggedIn.userID + '/rooms');

  var getRooms = function(callback) {
    myRooms.on('value', function(snap) {
      var roomlist = [];
      var result = snap.val();

      for (var key in result) {
        if (result[key] !== 'private') {
          roomlist.push({
            id: key,
            name: result[key]
          });
        }
      }

      callback(roomlist);
    });
  };

  return {
    getRooms: getRooms
  };

})

.factory('MyMessages', function($rootScope, $firebase) {

  var getMessages = function(roomID, callback) {
    var myMessages = $firebaseArray($rootScope.fb.child('messages/' + roomID));
    console.log(myMessages);
    callback(myMessages);
  };


  var getMessages = function(roomID, callback) {
    var myMessages = $rootScope.fb.child('messages/' + roomID);

    myMessages.on('value', function(snap) {
      var msglist = [];
      var result = snap.val();
      console.log(result);

      for (var key in result) {
        if (result[key] !== 'private') {
          msglist.push({
            id: key,
            text: result[key].text,
            sender: result[key].sender,
            timestamp: result[key].timestamp
          });
        }
      }

      callback(msglist);
    });
  };

  return {
    getMessages: getMessages
  };
})


// .factory('UserNames', function($rootScope, $firebase) {

// })

.controller('MessagesController', function ($scope, $rootScope, logout, MyRooms, MyMessages){
  $scope.messages;
  $scope.publicrooms;

  MyRooms.getRooms(function(list) {
    $scope.publicrooms = list;
    console.log($scope.publicrooms);
  });

  $scope.showMessages = function(room) {
    console.log(room.name);
    MyMessages.getMessages(room.id, function(msg) {
      $scope.messages = msg;
      console.log(msg[0].text);
    });
  };



  $scope.logout = logout.logout;

});
