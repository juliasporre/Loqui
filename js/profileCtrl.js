LoquiApp.controller('profileCtrl', function($scope, model, $routeParams){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('profile');
  $scope.url = splitedUrl[0];

  var nick = $routeParams.userID;
  var thisIsMe = false;

  if(nick == model.getUserName()){ //Needs to be checked so we know if the user should be able to change content
    thisIsMe = true;
  }

  if(thisIsMe){
    $scope.init = "My Profile"
  } else {
    scope.init = "Welcome to " + nick + "s Profile!"
  }


  $scope.goBack = function() {
    window.history.back();
  };
});
