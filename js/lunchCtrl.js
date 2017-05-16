//https://deploy.evothings.com/connect/YOUR-CONNECT-CODE
LoquiApp.controller('lunchCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('lunch');
  $scope.url = splitedUrl[0];
  var LUNCHBAGSEARCH = undefined;
  $scope.buttonOff = false;

  $scope.cancelSearch = function(){
    model.removeFromSearch(LUNCHBAGSEARCH);
    $scope.buttonOff = false;

  }

  var checkMatchedPartner = function(){
    if (this.partnerObject!=undefined){
      console.log("found someone!")
      foundAPartnerHandler(LUNCHBAGSEARCH, this.partnerObject);
      return;
    }
    else if ($scope.buttonOff==true){
      console.log("repeatedly check for partner")
      this.partnerObject = model.checkIfMatched(LUNCHBAGSEARCH); 
      console.log(this.partnerObject)
      setTimeout(checkMatchedPartner,3000);
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


  var searchForPartner = function(isThisALunchBagSearch){
    LUNCHBAGSEARCH = isThisALunchBagSearch;
  	//search for partner
    if (isThisALunchBagSearch){
      $scope.status = "Searching for a partner to eat a lunchbag with..."
    }
    else{
      $scope.status = "Searching for a partner to eat at some restaurant with..."
    }
    
    $scope.loading = true;
    $scope.buttonOff = true;
    
    partnerClass = model.searchForPartner(isThisALunchBagSearch);
    var hasPartner = false;
    console.log(partnerClass)
    if (partnerClass.length!=0){ //tell your partner that is has you as partner!
      for(i=1; i<partnerClass.length; i++){
        if(typeof partnerClass[index] !== 'undefined' && partnerClass[index] !== null){
          console.log("found a partner!")
          hasPartner = true;
          model.choosePartner(isThisALunchBagSearch,partnerClass[index]);
          foundAPartnerHandler(isThisALunchBagSearch, partnerClass[index]);
          return;
        }
      }
    }

    if(hasPartner==false){ //repeat until you have a partnerclass, here we dont have to tell the partner since it told us
      console.log("did not find a partner")
      this.partnerObject = undefined;
      checkMatchedPartner(isThisALunchBagSearch);
    }
  }

  $scope.lunchBagPartner = function(){
    searchForPartner(true);
  }

  $scope.restaurantPartner = function(){
    searchForPartner(false);
  }


});
