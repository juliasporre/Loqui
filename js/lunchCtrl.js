LoquiApp.controller('lunchCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('lunch');
  $scope.url = splitedUrl[0];

  $scope.lunchBagPartner = function(){
  	searchForPartner(true);
  }

  $scope.restaurantPartner = function(){
  	searchForPartner(false);
  }


  var searchForPartner = function(isThisALunchBagSearch){
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
      this.partnerObject = partnerClass;
      checkMatchedPartner();
      partnerClass = this.partnerObject;
    }


    //foundAPartnerHandler(isThisALunchBagSearch, partnerClass);
  }

  var checkMatchedPartner = function(){
    if (this.partnerObject!=undefined){
      alert("found someone!")
      return
    }
    else{
      alert("Trying again" + this.partnerObject)
      this.partnerObject = model.checkIfMatched(isThisALunchBagSearch); 
      //vilken funktion jag än sätter här så anropas den inte och nästa alert kommer inte
      alert("klar")
      //window.setTimeout("$scope.checkMatchedPartner();",100);
    }
} 

  var foundAPartnerHandler = function(isThisALunchBagSearch, partnerClass){
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
