LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;


  $scope.goBack = function() {
    window.history.back();
  }

  $scope.goChat = function(user) {
    $location.path('/privateMessages/'+user);
  }

  console.log(model.getPrivateMessangeConv());

  $scope.persons = model.getPrivateMessangeConv();



});
