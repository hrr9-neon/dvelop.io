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

.factory('MyChats', function($rootScope, $firebase, Membership) {
  var myRooms = $rootScope.fb.child('users/' + $rootScope.loggedIn.userID + '/rooms');

  var getRooms = function(callback) {
    myRooms.on('value', function(snap) {
      var privateList = [];
      var result = snap.val();

      for (var key in result) {
        if (result[key] === 'private') {
          Membership.getMembers(key, function(members) {
            privateList.push({
              id: key,
              user: members
            });
          });
        }
      }
      console.log(privateList);
      callback(privateList);
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

      callback(msglist);
    });
  };

  return {
    getMessages: getMessages
  };
})

.factory('Membership', function($rootScope, $firebase) {
  var getMembers = function(roomID, callback) {
    var memObj = $rootScope.fb.child('membership/' + roomID);

    memObj.on('value', function(snap) {
      var result = snap.val();
      var memArr;

      for (var key in result) {
        if ($rootScope.loggedIn.userID !== key) {
          memArr = {
            userid: key,
            name: result[key]
          };
        }
      }

      // var ret = memArr.join(', ');
      console.log(memArr);

      callback(memArr);
    });
  };

  return {
    getMembers: getMembers
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

.controller('MessagesController', function ($scope, $rootScope, $firebaseArray, logout, MyRooms, MyChats, MyMessages){
  $scope.messages;
  $scope.publicrooms;
  $scope.privaterooms;
  $scope.selectedPublicRoomIndex = -1;
  $scope.selectedPrivateRoomIndex = -1;
  $scope.selectedRoomID;
  $scope.message = '';

  MyRooms.getRooms(function(publiclist) {
    $scope.publicrooms = publiclist;
  });

  MyChats.getRooms(function(privatelist) {
    $scope.privaterooms = privatelist;
    console.log(privatelist);
  });

  $scope.showMessages = function(room, $index, roomType) {
    MyMessages.getMessages(room.id, function(msg) {
      $scope.messages = msg;
      $scope.selectedRoomID = room.id;
      if (roomType === 'public') {
        $scope.selectedPublicRoomIndex = $index;
        $scope.selectedPrivateRoomIndex = -1;
      } else {
        $scope.selectedPublicRoomIndex = -1;
        $scope.selectedPrivateRoomIndex = $index;
      }
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
