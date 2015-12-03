//NOTE - for testing purposes, the code starting at line 37 generates random users for mock data
//The "in-memory" test version has been commented out, the app is curently correctly using the Firebase DB

angular.module('dvelop.search', ['dvelop.auth'])

.factory('CheckRoomExist', function($rootScope, $firebase) {
  var checkRoom = function(userID, callback) {
    var memObj = $rootScope.fb.child('membership');

    memObj.on('value', function(snap) {
      var result = snap.val();
      console.log(result);
      var exist = null;
      for (var room in result) {
        console.log(result[room].hasOwnProperty($rootScope.loggedIn.userID));
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
.factory('MakeRoom', function($rootScope, $firebase) {
  var makeRoom = function(userID) {
    console.log('we need to make a new room here');
    console.log('sender=', $rootScope.loggedIn.userID);
    console.log('who=', userID);
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
    console.log(search.currentUser);
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
          MakeRoom.makeRoom(search.currentUser);
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

