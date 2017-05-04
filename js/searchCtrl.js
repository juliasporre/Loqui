LoquiApp.controller('searchCtrl', function($scope, model){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('search');
  $scope.url = splitedUrl[0];
  $scope.userName = model.getUserName();

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
