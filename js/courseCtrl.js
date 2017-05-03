LoquiApp.controller('courseCtrl', function($scope, model, $routeParams){
  var code = $routeParams.courseCode;
  model.addToRecent(code);
  
  model.getCourse.get({query : code}, function(data){
    $scope.course = data[1];

  },function(data){
      console.log("Cannot find course");
  });

  this.addFavorite = function(){
    model.addToFavorite(code);
  }

  this.removeFavorite = function(){
    model.removeFromFavorite(code);
  }


});
