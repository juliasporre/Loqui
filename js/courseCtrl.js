LoquiApp.controller('courseCtrl', function($scope, model, $routeParams){
  var code = $routeParams.courseCode;
  console.log("hej");
  console.log(code);

  model.addToRecent(code);

  model.getCourse.get({query : code}, function(data){
    console.log(data[1].url);
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
