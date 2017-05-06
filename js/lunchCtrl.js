LoquiApp.controller('lunchCtrl', function($scope, model){
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('lunch');
  $scope.url = splitedUrl[0];

  $scope.lunchBagPartner = function(){
  	$scope.loading = true;
  	scope.searchForPartner(true)
  }

  $scope.restaurantPartner = function(){
  	$scope.loading = true;
  	scope.searchForPartner(false)
  }

   $scope.searchForPartner = function(isThisALunchBagSearch){
  	//search for partner in some way
  	$scope.foundPartner = true; //how to update the view when a partner is found?
  	$scope.partner = admin; //the one found partners username here

  }
});
