LoquiApp.controller('privateMessagesCtrl', function($scope, model){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];

});
