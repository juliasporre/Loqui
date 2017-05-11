LoquiApp.controller('searchCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('search');
  $scope.url = splitedUrl[0];
  $scope.userName = model.getUserName();

  $scope.recentCourses = model.getRecentCourses();

  $scope.hasSearch = false;

  this.getSchools = function(){
      model.getSchools.get({},function(data){
      $scope.schools = data;
    },function(data){
      console.log("Cannot get schools");
    });
  }

  $scope.search = function(query){
    $scope.status = "Searching for " + query + "...";
    if(query != undefined){
      model.getCourse.get({query : query}, function(data){
        $scope.hasSearch = true;
        $scope.status = "";
        $scope.courses = data;
      },function(data){
          $scope.status = "Could not find the course...";
          console.log("Cannot find course");
      });
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


  this.getSchools();
});
