LoquiApp.controller('courseCtrl', function($scope, model, $routeParams){

  /* THIS IS NO LONGER USED */

  //Creates right url for redirection
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('course/');
  $scope.url = splitedUrl[0]

  //Adds course to recent courses
  var code = $routeParams.courseCode;
  model.addToRecent(code);

  // Checks if course if favorite
  $scope.isFavoriteCourse = model.isFavoriteCourse(code);

  //Add to favorite
  $scope.addFavorite = function(){
    model.addToFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  // Remove from favorite
  $scope.removeFavorite = function(){
    model.removeFromFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  // Gets searched course
  model.getCourse.get({query : code}, function(data){
    $scope.course = data[1];
    },function(data){
      console.log("Cannot find course");
    });
});
