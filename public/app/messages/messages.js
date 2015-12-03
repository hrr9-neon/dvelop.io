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

.factory('MyMessages', function($rootScope, $firebase, UserName) {

  var getMessages = function(roomID, callback) {
    var myMessages = $rootScope.fb.child('messages/' + roomID);

    myMessages.on('value', function(snap) {
      var msglist = [];
      var result = snap.val();

      for (var key in result) {
        if (result[key] !== 'private') {
          UserName.getUsername(result[key].sender, function(usrname) {
            msglist.push({
              id: key,
              text: result[key].text,
              sender: usrname.displayName,
              senderpic: usrname.profileImageUrl,
              timestamp: result[key].timestamp
            });

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


.factory('UserName', function($rootScope, $firebase) {

  var getUsername = function(userID, callback) {
    var userObj = $rootScope.fb.child('users/' + userID);

    userObj.on('value', function(snap) {
      var result = snap.val();

      callback(result);
    });
  };

  return {
    getUsername: getUsername
  };
})

.factory('GUID', function() {
  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }

  return {
    guid: guid
  };
})

.controller('MessagesController', function ($scope, $rootScope, $firebaseArray, logout, MyRooms, MyMessages, GUID){
  $scope.messages;
  $scope.publicrooms;
  $scope.selectedRoomIndex = -1;
  $scope.selectedRoomID;
  $scope.message = '';

  MyRooms.getRooms(function(list) {
    $scope.publicrooms = list;
  });

  $scope.showMessages = function(room, $index) {
    MyMessages.getMessages(room.id, function(msg) {
      $scope.messages = msg;
      $scope.selectedRoomIndex = $index;
      $scope.selectedRoomID = room.id;
    });
  };

  $scope.sendMessage = function() {
    if($scope.message.length > 0) {

      var ref = $rootScope.fb.child('messages/' + $scope.selectedRoomID);
      var msgs = $firebaseArray(ref);

      msgs.$add({
        sender: $rootScope.loggedIn.userID,
        text: $scope.message,
        timestamp: Firebase.ServerValue.TIMESTAMP
      });

      $scope.message = '';
    }
  };

  $scope.logout = logout.logout;

});
