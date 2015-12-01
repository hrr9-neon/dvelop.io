//NOTE - for testing purposes, the code starting at line 37 generates random users for mock data
//The "in-memory" test version has been commented out, the app is curently correctly using the Firebase DB

angular.module('dvelop.search', ['dvelop.auth'])

.controller('SearchController', function ($scope, SearchService, logout, $location, $firebaseArray, $firebaseObject){

  var search = this;

  search.input = ''

  //local memory version
  // search.users = SearchService.users;

  // DB version : retrieving the data from DB. 
  search.users = $firebaseArray(new Firebase("https://shining-torch-3159.firebaseio.com/users"));
    //it is possible that you call object as an array using $firebaseArray;

  // search.users = $firebaseObject(new Firebase("https://shining-torch-3159.firebaseio.com/users")); //object version
  // console.log('usersinDB:',search.users);

  //logout func
  search.logout = logout.logout;

})

//service for SearchService
.factory('SearchService', function ($http, $rootScope, $firebaseArray){

  var searchService = {};

  // searchService.userRef = $firebaseArray(new Firebase("https://shining-torch-3159.firebaseio.com/users")); //array version
  searchService.userRef = new Firebase("https://shining-torch-3159.firebaseio.com/users"); 

  ////////////////////////////////////////////////////
  //Random User Generator - Irrelevant at the moment//
  ////////////////////////////////////////////////////
  var userGenerator = function(userNum){
    var users = [];
    var user = {}
    var firstNameCollection = ['Shan', 'Peter', 'Sam', 'Alice', 'Nick', 'Bella', 'Erik', 'Dan'];
    var lastNameCollection = ['Batla', 'Park', 'Kim', 'Shen', 'Green', 'Bowler'];
    var addressCollection = ['Soul, South Korea', 'New orlendo, US', 'New York, US', 'New Jersey, US', 'Los Angeles, US'];
    var skillCollection = ['advanced', 'intermediate', 'novice'];
    var interestCollection = ['AngularJS', 'ReactJS', 'BackboneJS', 'NodeJS', 'ExpressJS', 'MongoDB'];
    var bestAtCollection = ['AngularJS', 'ReactJS', 'Backbone', 'NodeJS', 'ExpressJS', 'MongoDB'];
    var jobCollection = ['Software Engineer', 'Full Stack Engineer', 'Front-end Engineer', 'Backend Enginner'];
    var zipCode = function(){
      var numCol = '1234567890';
      var result = '1';
      for(var i=0; i<4; i++){
        result += Math.floor(Math.random()*numCol.length);
      }
      return result;
    }
    var userIdGen = function(){
      var numCol = '1234567890';
      var result = '1';
      for(var i=0; i<6; i++){
        result += Math.floor(Math.random()*numCol.length);
      }
      return result;
    }
    var yearExpGen = function(){
      var numCol = '123456789';
      return Math.floor(Math.random()*numCol.length);
    }

    var avatarGen = function() {
      var baseUrl = 'https://randomuser.me/api/portraits/';
      var gender = ['men', 'women'];
      var randomNum = Math.floor(Math.random()*50);
      var resultUrl = baseUrl+gender[Math.floor(Math.random()*gender.length)]+'/'+randomNum+'.jpg';
      return resultUrl;
    }

    for(var i=0; i<userNum; i++){
      user.avatar = avatarGen();
      user.userID = userIdGen();
      user.firstName = firstNameCollection[Math.floor(Math.random()*firstNameCollection.length)];
      user.lastName = lastNameCollection[Math.floor(Math.random()*lastNameCollection.length)];
      user.address = addressCollection[Math.floor(Math.random()*addressCollection.length)];
      user.zipCode = zipCode();
      user.skillLevel = skillCollection[Math.floor(Math.random()*skillCollection.length)];
      user.yearExperience = yearExpGen();
      user.bestAt = bestAtCollection[Math.floor(Math.random()*bestAtCollection.length)];
      user.interest = interestCollection[Math.floor(Math.random()*interestCollection.length)];
      user.job = jobCollection[Math.floor(Math.random()*jobCollection.length)];

      users.push(angular.copy(user));
    }
    // console.log('usersinthefunc',users);
    return users;
  }

  //Pass into userGenerator the number of random users you want to generate for mock data testing purposes - DO NOT COMMENT OUT, IT WILL BREAK THE APP
  searchService.users = userGenerator(0);
  

  //inserting the data to firebase DB uding the users Mock Data
  for(var i=0; i<searchService.users.length; i++){

    var user = {

      displayName: searchService.users[i].firstName + ' ' + searchService.users[i].lastName,
      emailAddress: searchService.users[i].firstName+'.'+searchService.users[i].lastName+'@HRR.io',
      job: searchService.users[i].job,
      address: searchService.users[i].address,
      professionalLevel: searchService.users[i].skillLevel,
      profileImageUrl: searchService.users[i].avatar,
      techSkill: 'MEAN Stack',
      mentorAvail: [true,false][Math.floor(Math.random()*2)],
      helpAvail: [true,false][Math.floor(Math.random()*2)],
      bestAt: searchService.users[i].bestAt,

    };

    // searchService.userRef.$add(user); //array version
    searchService.userRef.child(searchService.users[i].userID).update(user); //object version
  }

  return searchService;
})
