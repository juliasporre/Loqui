LoquiApp.controller('searchCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('search');
  $scope.url = splitedUrl[0];

  $scope.userName = model.getUserName();

  $scope.recentCourses = model.getRecentCourses();

  $scope.isFavoriteCourse = false;

  $scope.hasSearch = false;
  $scope.loading = false;

  var code = "";
  var color = "";
  $scope.search = function(query){
    $scope.loading = true;
    if(query != undefined){
      $scope.status = "Searching for " + query + "...";
      model.getCourse.get({query : query}, function(data){
        $scope.hasSearch = true;
        $scope.status = "";
        $scope.courses = data;
        code = data[1].code;
        color = data[1].color;
        $scope.isFavoriteCourse = model.isFavoriteCourse(code);
        model.getRooms(code); //to make sure there is a general-room already, or else make one
        $scope.loading = false;
      },function(data){
        $scope.loading = false;
        $scope.status = "Could not find the course...";
      });
    }else{
      $scope.loading = false;
      alert("You need to write something to search for")
    }
  }

  $scope.addFavorite = function(){
    model.addToFavorite(code, color);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  $scope.removeFavorite = function(){
    model.removeFromFavorite(code, color);
    $scope.isFavoriteCourse = model.isFavoriteCourse(code);
  }

  $scope.goToCourse = function(course) {
    console.log("goToCourse" + course )
    $location.path('/chatRoom/'+course+"-General");
  }

});
