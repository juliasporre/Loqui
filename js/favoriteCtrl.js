LoquiApp.controller('favoriteCtrl', function($scope, model, $location){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split("favorites");
  var url = splitedUrl[0]

  $scope.favorites = model.getFavoriteCourses();
  if ($scope.favorites.length == 0){
    $scope.favExcists = false;
  }else {
    $scope.favExcists = true;
  }

  $scope.remove = function(fav){
    model.removeFromFavorite(fav.courseName, fav.color);
  }

  $scope.goToFav = function(fav){
  	$location.path("/chatRoom/" + fav.courseName + "-General");
  }
});
