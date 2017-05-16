//https://deploy.evothings.com/connect/YOUR-CONNECT-CODE
LoquiApp.controller('lunchCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('lunch');
  $scope.url = splitedUrl[0];
  var LUNCHBAGSEARCH = undefined;
  $scope.buttonOff = false;
  var PARTNERLIST = false;

  $scope.cancelSearch = function(){
    model.removeFromSearch(LUNCHBAGSEARCH);
    $scope.buttonOff = false;
    $scope.status = ""
    $scope.loading = false;

  }

  var checkMatchedPartner = function(){

    var d = $.Deferred();
    if (PARTNERLIST.length>0){
      console.log("found someone!")
      foundAPartnerHandler(LUNCHBAGSEARCH, PARTNERLIST);
      return;
    }
    else if ($scope.buttonOff==true){
      console.log("repeatedly check for partner")
      PARTNERLIST = model.checkIfMatched(LUNCHBAGSEARCH); 
      $.when(d).done(function(list) {
        console.log(list)
        checkMatchedPartner();
      });
      setTimeout(function() {
        d.resolve(PARTNERLIST);
      }, 5000);
    }
  } 

  var foundAPartnerHandler = function(isThisALunchBagSearch, partnerClass){
    model.removeFromSearch(isThisALunchBagSearch);
    $scope.$apply(function(){
      if (isThisALunchBagSearch){
        $scope.status = "Found a partner to eat a lunchbag with! Write something!"
      }
      else{
        $scope.status = "Found a partner to eat at a restaurant with! Write something!"
      }
      $scope.foundPartner = true; //how to update the view when a partner is found
      $scope.partner = partnerClass[0]; //the one found partners username here
      $scope.partnerColor = partnerClass[1];
      $scope.buttonOff = false;
    });
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
    
    var hasPartner = false;
    $scope.loading = true;
    $scope.buttonOff = true;
    var d = $.Deferred();
    list = model.searchForPartner(isThisALunchBagSearch);
    
    $.when(d).done(function(listPartners) {
      for(i=0; i<listPartners.length; i++){
        if(typeof listPartners[i] !== 'undefined'){
          console.log("found a partner!")
          hasPartner = true;
          model.choosePartner(isThisALunchBagSearch,listPartners[i]);
          foundAPartnerHandler(isThisALunchBagSearch, listPartners[i]);
          return;
        }
      }

      if(hasPartner==false){ //repeat until you have a partnerclass, here we dont have to tell the partner since it told us
        console.log("did not find a partner")
        checkMatchedPartner(isThisALunchBagSearch);
      }
    });
    setTimeout(function() {
      d.resolve(list);
    }, 5000);
    
  }

  $scope.lunchBagPartner = function(){
    searchForPartner(true);
  }

  $scope.restaurantPartner = function(){
    searchForPartner(false);
  }


});
