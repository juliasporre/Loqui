LoquiApp.controller('profileCtrl', function($scope, model, $routeParams){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('profile');
  $scope.url = splitedUrl[0];

  var nick = $routeParams.userID;
  $scope.nick = nick;
  $scope.age = 12
  $scope.studying = "CL"
  $scope.description = "I am a nice person and I like to code." //GET THESE FROM THE DATABASE

  var thisIsMe = false;
  $scope.thisIsMe = thisIsMe;

  if(nick == model.getUserName()){ //Needs to be checked so we know if the user should be able to change content
    thisIsMe = true;
    $scope.thisIsMe = thisIsMe;
  }

  if(thisIsMe){
    $scope.init = "My Profile"
  } else {
    $scope.init = nick + "s Profile!"
  }


  $scope.goBack = function() {
    window.history.back();
  };
});
