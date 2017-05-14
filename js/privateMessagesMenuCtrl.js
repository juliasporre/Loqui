LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;
  
  $scope.persons = [{username: "kalleanka",
                    name: "Kalle Anka",
                    color: "#0099ff"
                  },
                  {username: "blabla",
                      name: "Bla Bla",
                      color: "#00ffcc"
                  }];


  $scope.goBack = function() {
    window.history.back();
  }

  $scope.goChat = function(user) {
    console.log(user);
    $location.path('/privateMessages/'+user);
  }

});
