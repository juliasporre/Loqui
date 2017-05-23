LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model, $location){

  //Creates right url for redirection
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;


  // Search for friend in database. If the userName exsists, you get redirected to your private chatroom
  var search = function(friend){
    var lowerFriend = friend.toLowerCase();
    var ref = model.database.ref('users/'+lowerFriend);
    ref.once("value").then(function(snapshot){
      if(snapshot.exists()){
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

        goto('/privateMessages/'+lowerFriend);

      }
      else{
        alert("That user does not exists")
      }
    });
  }

  //redirection function
  var goto = function(path){
  $location.path(path);
  }

  // Go back to previous view
  $scope.goBack = function() {
    window.history.back();
  }

  // Go to Private chatroom with other user.
  $scope.goChat = function(user) {
    var lowerUser = user.toLowerCase();
    $location.path('/privateMessages/'+lowerUser);
  }

  // Gets list with those you have a private conversation with
  $scope.persons = model.getPrivateMessangeConv();

  //Search for friend to start a private connversation with
  $scope.searchFriend = function(friend){
    search(friend);
  }



});
