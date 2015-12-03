//NOTE - for testing purposes, the code starting at line 37 generates random users for mock data
//The "in-memory" test version has been commented out, the app is curently correctly using the Firebase DB

angular.module('dvelop.search', ['dvelop.auth'])

.factory('CheckRoomExist', function($rootScope, $firebase) {
  var checkRoom = function(userID, callback) {
    var memObj = $rootScope.fb.child('membership');

    //seth changed this from memObj.on... to memObj.once...
    //to avoid crazy database behaviors when this is continually listening...
    memObj.once('value', function(snap) {
      var result = snap.val();
      console.log('value of the membership snapshot:', result);
      var exist = null;
      for (var room in result) {
        console.log('value of membership snapshot room attribute: does it have property of userID?', result[room].hasOwnProperty($rootScope.loggedIn.userID));
        if (result[room].hasOwnProperty($rootScope.loggedIn.userID) && result[room].hasOwnProperty(userID)) {
          exist = room;
        }


        // memObj.child(room).on('value', function(snapshot) {
        //   var users = snapshot.val();
        //   var both = true;
        //   for (var key in users) {
        //     both = both && (key === $rootScope.loggedIn.userID || key === userID);
        //   }

        //   callback(room);
        // });
      }
      callback(exist);
    });
  };

  return {
    checkRoom: checkRoom
  };
})

//seth added this and added this factory to SearchController
.factory('MakeRoom', function($rootScope, $firebaseArray, $firebase) {
  var makeRoom = function(userID, callback) {
    //console.log('we need to make a new room here');
    //console.log('sender=', $rootScope.loggedIn.userID);
    var senderID = $rootScope.loggedIn.userID;
    //console.log('who=', userID);
    var recipientID = userID;
    //step1: create room
    var roomref = $rootScope.fb.child('rooms');
    var rooms = $firebaseArray(roomref);
    rooms.$add({type: "private"}).then(function(ref) {
      var roomid = ref.key();
      console.log("added room with id " + roomid);
      //step2: create membership
      var membershipsref = $rootScope.fb.child('membership');
      var memberships = $firebaseArray(membershipsref);
      //have to get users.displayName
      var newmembership = {};
      var usersref = $rootScope.fb.child('users');
      var users = $firebaseArray(usersref);
      users.$loaded().then(function() {
        var senderUser = null;
        var recipientUser = null;
        var sendUserRef = new Firebase('https://shining-torch-3159.firebaseio.com/users/' + senderID);
        var recipientUserRef = new Firebase('https://shining-torch-3159.firebaseio.com/users/' + recipientID);
        angular.forEach(users, function(user) {
          //console.log(user, senderID, recipientID);
          if(user.$id === senderID) {
            newmembership[user.$id] = user.displayName;
            senderUser = user;
            if(senderUser.rooms === undefined) {
              senderUser.rooms = {};
            }
          } else if (user.$id === recipientID) {
            newmembership[user.$id] = user.displayName;
            recipientUser = user;
            if(recipientUser.rooms === undefined) {
              recipientUser.rooms = {};
            }
          }
        });

        // var mships = $firebase(membershipsref);
        membershipsref.child(roomid).set(newmembership);
        //console.log(newmembership);
        console.log("senderUser rooms", senderUser.rooms);
        senderUser.rooms[roomid] = "private";
        recipientUser.rooms[roomid] = "private";
        sendUserRef.update({rooms: senderUser.rooms}, function(error) {
          if(error) {
            console.log('sync error with sender', error);
          } else {
            console.log('sync succeed with sender');
            recipientUserRef.update({rooms: recipientUser.rooms}, function(error) {
              if(error) {
                console.log('sync error with recipient', error);
              } else {
                console.log('sync succeed with recipient');
                callback();
              }
            });
          }
        });

        // memberships.$add(newmembership).then(function(memref) {
        //   var memrefid = memref.key();
        //   console.log("added membership with id " + memrefid);
        //   //step3: add room to users, make sure value is always private
        // });
      });
      // for(user in users) {
      //   if(user === senderID) {
      //     newmembership[senderID] = user.displayName;
      //   }
      // }
      // console.log(newmembership);

    });
    //create room
      //id assigned automatically
      //don't need name
      //type: "private"
      //{id: id, type: "private"}
      //create ref to obj
      //
    //get room id
    //make membership
    //add room to users (make sure value is always "private")
    //var ref = $rootScope.fb.child('membership')
    //var membershiparr = $firebaseArray(ref);
    //membershiparr.$add()

    /*
    var ref = $rootScope.fb.child('messages/' + search.roomID);
    var msgs = $firebaseArray(ref);
    console.log('these are msgs in room: ', msgs);
    msgs.$add({
      sender: $rootScope.loggedIn.userID,
      text: search.message,
      timestamp: Firebase.ServerValue.TIMESTAMP
    })
    */

  };

  return {
    makeRoom: makeRoom
  };
})

.controller('SearchController', function (currentAuth, $scope, $rootScope, logout, $location, $firebaseArray, $firebaseObject, CheckRoomExist, MakeRoom){

  var search = this;

  search.input = '';
  search.currentUser = '';
  search.message = '';
  search.roomID = null;

  search.changeUser = function(userid) {
    search.currentUser = userid;
    console.log('search.currentUser reset to', search.currentUser);
  };

  //seth did not touch this original version...
  // search.sendMessage = function() {
  //   if(search.message.length > 0) {

  //     CheckRoomExist.checkRoom(search.currentUser, function(result){
  //       search.roomID = result;
  //     });
  //     console.log(search.roomID);
  //     if (search.roomID) {
  //       var ref = $rootScope.fb.child('messages/' + search.roomID);
  //       var msgs = $firebaseArray(ref);
  //       msgs.$add({
  //         sender: $rootScope.loggedIn.userID,
  //         text: search.message,
  //         timestamp: Firebase.ServerValue.TIMESTAMP
  //       });
  //       $scope.message = '';
  //     }
  //   }
  // };

  //seth was playing with this...
  search.sendMessage2 = function() {
    if(search.message.length > 0) {

      console.log('trying to send message', search.message);

      CheckRoomExist.checkRoom(search.currentUser, function(result){
        search.roomID = result;
        console.log('search.roomID=', search.roomID);
        if (search.roomID) {
          var ref = $rootScope.fb.child('messages/' + search.roomID);
          var msgs = $firebaseArray(ref);
          console.log('these are msgs in room: ', msgs);
          msgs.$add({
            sender: $rootScope.loggedIn.userID,
            text: search.message,
            timestamp: Firebase.ServerValue.TIMESTAMP
          }).then(function(ref) {
            //this promise added mainly to try to zero out $scope.message
            //not working to do that
            var id = ref.key();
            console.log("added record with id " + id);
            $scope.message = '';
          });
        } else {
          console.log('search.roomID is falsy', search.roomID);
          MakeRoom.makeRoom(search.currentUser, search.sendMessage2);
        }
      });
    }
    //this is not resetting msg to blank after send??
    //$scope.message = '';
  };

  // DB version : retrieving the data from DB.
  // search.users = $firebaseArray(new Firebase("https://shining-torch-3159.firebaseio.com/users"));
  search.users = $firebaseArray($rootScope.fb.child('users'));
  //it is possible that you call object as an array using $firebaseArray;

  // search.users = $firebaseObject(new Firebase("https://shining-torch-3159.firebaseio.com/users")); //object version
  // console.log('usersinDB:',search.users);

  //logout func
  search.logout = logout.logout;

})

.filter("multiWordFilter", function($filter){
    return function(inputArray, searchText){
        var wordArray = searchText ? searchText.toLowerCase().split(/\s+/) : [];
        var wordCount = wordArray.length;
        for(var i=0; i<wordCount; i++){
            inputArray = $filter('filter')(inputArray, wordArray[i]);
        }
        return inputArray;
    };
});

