LoquiApp.controller('searchCtrl', function($scope, model){
  console.log(model.getRecentCourses());
  $scope.recentCourses = model.getRecentCourses();
  this.getSchools = function(){
      model.getSchools.get({},function(data){
      $scope.schools = data;
    },function(data){
      console.log("Cannot get schools");
    });
  }

  $scope.search = function(query, type){
    console.log(query);
    console.log(type);
    if(query != undefined){
      model.getCourse.get({query : query}, function(data){
        console.log(data);
        console.log(data.name);
        $scope.courses = data;
      },function(data){
          console.log("Cannot find course");
      });
    }
  }


  this.getSchools();
});
