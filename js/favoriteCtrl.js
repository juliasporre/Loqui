LoquiApp.controller('favoriteCtrl', function($scope, model, $location){

  //Creates right url for redirection
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split("favorites");
  var url = splitedUrl[0];
  $scope.url = url;

  //Gets favorite courses from model
  $scope.favorites = model.getFavoriteCourses();

  //Checks if favorites is empty or not.
  if ($scope.favorites.length == 0){
    $scope.favExcists = false;
  }else {
    $scope.favExcists = true;
  }

  //Remove course from favorites
  $scope.remove = function(fav){
    model.removeFromFavorite(fav.courseName, fav.color);
  }

  //Redirection to favorites
  $scope.goToFav = function(fav){
  	$location.path("/chatRoom/" + fav.courseName + "-General");
  }
});
