LoquiApp.controller('favoriteCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split("favorites");
  $scope.url = splitedUrl[0]
  $scope.favorites = model.getFavoriteCourses();

  console.log("$scope.favorites: "+$scope.favorites);
  $scope.remove = function(course){
    model.removeFromFavorite(course);
  }
});
