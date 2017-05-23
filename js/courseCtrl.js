LoquiApp.controller('courseCtrl', function($scope, model, $routeParams){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('course/');
  $scope.url = splitedUrl[0]

  var code = $routeParams.courseCode;
  model.addToRecent(code);

  $scope.isFavoriteCourse = model.isFavoriteCourse(code);

  $scope.addFavorite = function(){
    model.addToFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  $scope.removeFavorite = function(){
    model.removeFromFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  model.getCourse.get({query : code}, function(data){
    $scope.course = data[1];
    },function(data){
      console.log("Cannot find course");
    });
});
