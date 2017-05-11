LoquiApp.controller('lunchCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('lunch');
  $scope.url = splitedUrl[0];

  $scope.lunchBagPartner = function(){
  	$scope.searchForPartner(true)
  }

  $scope.restaurantPartner = function(){
  	$scope.searchForPartner(false)
  }

   $scope.searchForPartner = function(isThisALunchBagSearch){
  	//search for partner in some way
    if (isThisALunchBagSearch){
      $scope.status = "Searching for a partner to eat a lunchbag with..."
    }
    else{
      $scope.status = "Searching for a partner to eat at some restaurant with..."
    }
    
    $scope.loading = true;
    
    partnerClass = model.searchForPartner(isThisALunchBagSearch);
    $scope.foundAPartnerHandler(isThisALunchBagSearch, partnerClass);

  }

  $scope.foundAPartnerHandler = function(isThisALunchBagSearch, partnerClass){
    if (isThisALunchBagSearch){
      $scope.status = "Found a partner to eat a lunchbag with! Write something!"
    }
    else{
      $scope.status = "Found a partner to eat at a restaurant with! Write something!"
    }
    $scope.foundPartner = true; //how to update the view when a partner is found?
    $scope.partner = partnerClass.username; //the one found partners username here
    $scope.partnerColor = partnerClass.color;
  }
});
