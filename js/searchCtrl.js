LoquiApp.controller('searchCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('search');
  $scope.url = splitedUrl[0];

  $scope.userName = model.getUserName();

  $scope.recentCourses = model.getRecentCourses();

  $scope.hasSearch = false;

  $scope.search = function(query){
    if(query != undefined){
      $scope.status = "Searching for " + query + "...";
      model.getCourse.get({query : query}, function(data){
        $scope.hasSearch = true;
        $scope.status = "";
        $scope.courses = data;
      },function(data){
        $scope.status = "Could not find the course...";
      });
    }else{
      alert("You need to write something to search for")
    }
  }

  $scope.isFavoriteCourse = function(code){
    return model.isFavoriteCourse(code);
  }

  $scope.addFavorite = function(code){
    model.addToFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
    model.addToRecent(code);
  }

  $scope.removeFavorite = function(code){
    model.removeFromFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  $scope.goToCourse = function(course) {
    $location.path('/chatRoom/'+course+"-General");
  }

});
