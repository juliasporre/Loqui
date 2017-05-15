LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;


  var search = function(friend){
    var ref = model.database.ref('users/'+friend);
    ref.once("value").then(function(snapshot){
      if(snapshot.exists()){
        var other = {
          username: snapshot.val().username,
          name: snapshot.val().name,
          color: snapshot.val().color
        };
        model.database.ref('users/'+model.username+'/convos/'+other.name).once("value").then(function(snapshot){
          if(snapshot.exists()){
            console.log("already friend");
          } else {
            model.addPrivateMessangeConv(other);
            model.addOtherPrivateMessangeConv(other);
          }
        });
      }
    });
  }

  var goto = function(path){
  $location.path(path);
  }


  $scope.goBack = function() {
    window.history.back();
  }

  $scope.goChat = function(user) {
    $location.path('/privateMessages/'+user);
  }

  console.log(model.getPrivateMessangeConv());

  $scope.persons = model.getPrivateMessangeConv();

  $scope.searchFriend = function(friend){
    search(friend);
    goto('/privateMessages/'+friend);

  }



});
