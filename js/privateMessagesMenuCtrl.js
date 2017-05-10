LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;
  $scope.persons = [{username: "kalle.anka",
                    name: "Kalle Anka"
                  },
                  {username: "blabla",
                      name: "Bla Bla"
                  }];


  $scope.goBack = function() {
    window.history.back();
  };

});
