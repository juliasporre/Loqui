LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model, $location){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;


  var search = function(friend){
    var lowerFriend = friend.toLowerCase();
    var ref = model.database.ref('users/'+lowerFriend);
    ref.once("value").then(function(snapshot){
      if(snapshot.exists()){
        console.log("FRIEND:")
        console.log(snapshot.val())
        var other = {
          username: snapshot.val().username,
          name: snapshot.val().name,
          color: snapshot.val().color
        };
        var lowerUserName = model.getUserName().toLowerCase();
        model.database.ref('users/'+ lowerUserName +'/convos/'+lowerFriend).once("value").then(function(snapshot){
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
    var lowerUser = user.toLowerCase();
    $location.path('/privateMessages/'+lowerUser);
  }

  console.log(model.getPrivateMessangeConv());

  $scope.persons = model.getPrivateMessangeConv();

  $scope.searchFriend = function(friend){
    search(friend);
    var lowerFriend = friend.toLowerCase();
    goto('/privateMessages/'+lowerFriend);

  }



});
