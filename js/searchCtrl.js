LoquiApp.controller('searchCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('search');
  $scope.url = splitedUrl[0];

  $scope.userName = model.getUserName();

  $scope.recentCourses = model.getRecentCourses();

  $scope.isFavoriteCourse = false;

  $scope.hasSearch = false;

  var code = "";
  $scope.search = function(query){

    if(query != undefined){
      $scope.status = "Searching for " + query + "...";
      model.getCourse.get({query : query}, function(data){
        $scope.hasSearch = true;
        $scope.status = "";
        $scope.courses = data;
        code = data[1].code;
        $scope.isFavoriteCourse = model.isFavoriteCourse(code);
        model.getRooms(code); //to make sure there is a general-room already, or else make one
      },function(data){
        $scope.status = "Could not find the course...";
      });
    }else{
      alert("You need to write something to search for")
    }
  }

  $scope.addFavorite = function(){
    model.addToFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  $scope.removeFavorite = function(){
    model.removeFromFavorite(code);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  $scope.goToCourse = function(course) {
    $location.path('/chatRoom/'+course+"-General");
  }

});
