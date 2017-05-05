LoquiApp.controller('privateMessagesCtrl', function($scope, model){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.friend = "PålPlutt" //The one you are sending private messages with

  //Do the same kind of messagehandling as in chatrom with sendmessage and onmessagearrived. 

  $scope.goBack = function() {
    window.history.back();
  };

});
