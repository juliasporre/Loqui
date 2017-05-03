LoquiApp.controller('searchCtrl', function($scope, model){

  $scope.url = window.location.href;
  $scope.recentCourses = model.getRecentCourses();
  this.getSchools = function(){
      model.getSchools.get({},function(data){
      $scope.schools = data;
    },function(data){
      console.log("Cannot get schools");
    });
  }

  $scope.search = function(query, type){
    if(query != undefined){
      model.getCourse.get({query : query}, function(data){
        $scope.courses = data;
      },function(data){
          console.log("Cannot find course");
      });
    }
  }


  this.getSchools();
});
