LoquiApp.controller('profileCtrl', function($scope, model, $routeParams){

  console.log("setting profile data...");

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('profile');
  $scope.url = splitedUrl[0];
  var userName = $routeParams.userID;
  $scope.userName = userName;
  var database = model.getDatabase();

  //Check if it is your own profile

  var thisIsMe = false;
  if(userName == model.getUserName()){ //Needs to be checked so we know if the user should be able to change content
    thisIsMe = true;

    $scope.name = model.getUserFullName();
    $scope.age = model.getAge();
    $scope.studying = model.getStudying();
    $scope.description = model.getDescription(); //GET THESE FROM THE DATABASE
    $scope.userColor = model.getColor();
  }else{
    var ref = database.ref('users/'+userName);
    ref.once("value").then(function(snapshot){
      console.log(snapshot.val());
        $scope.name = snapshot.val().name;
        $scope.age = snapshot.val().age;
        $scope.studying = snapshot.val().studying;
        $scope.description = snapshot.val().description;
        $scope.userColor = snapshot.val().color;
    });
  }
  $scope.thisIsMe = thisIsMe;

  if(thisIsMe){
    $scope.init = "My Profile";
  } else {
    $scope.init = userName + "s Profile";
  }

  $scope.saveChanges = function(){
    if($scope.name != document.getElementById("name").value){
      model.setFullName(document.getElementById("name").value);
      $scope.name = model.getUserFullName();
    }
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
    alert("Your changes in profile were made!");
  }

  $scope.randomColor = function(){
    var list = model.colorsToRandomFrom;
    var done = false;
    while (done != true){
      var rand = list[Math.floor(Math.random() * list.length)];
      if($scope.userColor != rand){
        model.setColor(rand);
        $scope.userColor = model.getColor();
        done= true;
      }
    }
  }

  $scope.goBack = function() {
    window.history.back();
  }

  $scope.setFocus=function(id){
    $("#"+id).focus();
    $('.blueBox').animate({
      scrollTop: ($("#"+id).offset().top-50)
    });
  }

});
