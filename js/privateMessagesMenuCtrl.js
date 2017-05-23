LoquiApp.controller('privateMessagesMenuCtrl', function($scope, model, $location){



  //Creates right url for redirection
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.urlMess = urlOrg;
  $scope.loading = false;

  //redirection function
  var goto = function(path){
    $location.path(path);
  }

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
            $scope.$apply(function(){
              $scope.persons = model.getPrivateMessangeConv();
              $scope.loading = false;
            })
          }
        });
      }
      else{
        alert("That user does not exists")
      }

    });

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




  //Search for friend to start a private connversation with
  $scope.searchFriend = function(friend){
    $scope.loading = true;
    search(friend);
  }

  // Gets list with those you have a private conversation with
  model.getPrivateMessangeConv(function(list){
    console.log(list);
    $scope.people = list;
    angular.element('#findpep').triggerHandler('click');
  });




});
