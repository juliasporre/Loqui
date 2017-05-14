LoquiApp.controller('lunchCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('lunch');
  $scope.url = splitedUrl[0];

  $scope.lunchBagPartner = function(){
  	$scope.searchForPartner(true);
  }

  $scope.restaurantPartner = function(){
  	$scope.searchForPartner(false);
  }


  $scope.searchForPartner = function(isThisALunchBagSearch){
  	//search for partner
    if (isThisALunchBagSearch){
      $scope.status = "Searching for a partner to eat a lunchbag with..."
    }
    else{
      $scope.status = "Searching for a partner to eat at some restaurant with..."
    }
    
    $scope.loading = true;
    
    partnerClass = model.searchForPartner(isThisALunchBagSearch);
    if (partnerClass!=undefined){ //tell your partner that is has you as partner!
      alert("found a partner!")
      model.choosePartner(isThisALunchBagSearch,partnerClass.first());
    }

    if (partnerClass==undefined){ //repeat until you have a partnerclass, here we dont have to tell the partner since it told us
      $scope.partnerObject = partnerClass;
      $scope.checkMatchedPartner();
      partnerClass = $scope.partnerObject;
    }


    //$scope.foundAPartnerHandler(isThisALunchBagSearch, partnerClass);
  }

  $scope.checkMatchedPartner = function(){
    if ($scope.partnerObject!=undefined){
      alert("found someone!")
      return
    }
    else{
      alert("Trying again")
      $scope.partnerObject = model.checkIfMatched(isThisALunchBagSearch);
      alert("klar")
      //window.setTimeout("$scope.checkMatchedPartner();",100);
    }
} 

  $scope.foundAPartnerHandler = function(isThisALunchBagSearch, partnerClass){
    model.removeFromSearch(isThisALunchBagSearch);
    if (isThisALunchBagSearch){
      $scope.status = "Found a partner to eat a lunchbag with! Write something!"
    }
    else{
      $scope.status = "Found a partner to eat at a restaurant with! Write something!"
    }
    $scope.foundPartner = true; //how to update the view when a partner is found
    $scope.partner = partnerClass.user; //the one found partners username here
    $scope.partnerColor = partnerClass.color;
  }
});
