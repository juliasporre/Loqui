LoquiApp.controller('profileCtrl', function($scope, model, $routeParams){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('profile');
  $scope.url = splitedUrl[0];

  var userName = $routeParams.userID;
  $scope.userName = userName;

  //Check if it is your own profile
  var thisIsMe = false;
  if(userName == model.getUserName()){ //Needs to be checked so we know if the user should be able to change content
    thisIsMe = true;
    $scope.thisIsMe = thisIsMe;
    console.log(typeof(model.getAge()));
    $scope.age = model.getAge();
    $scope.studying = model.getStudying();
    $scope.description = model.getDescription(); //GET THESE FROM THE DATABASE
  }
  $scope.thisIsMe = thisIsMe;

  if(thisIsMe){
    $scope.init = "My Profile"
  } else {
    $scope.init = userName + "s Profile!"
  }


  $scope.saveChanges = function(){

    if($scope.age != document.getElementById("age").value){
      model.setAge(document.getElementById("age").value);
      $scope.age = model.getAge();
    }
    if($scope.studying != document.getElementById("studying").value){
      model.setStudying(document.getElementById("studying").value);
      $scope.studying = model.getStudying();
    }
    if($scope.description != document.getElementById("comment").value){
      model.setDescription(document.getElementById("comment").value);
      $scope.description = model.getDescription();
    }

  }


  $scope.goBack = function() {
    window.history.back();
  };
});
