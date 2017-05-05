LoquiApp.controller('landingCtrl', function($scope, model, $location){

	var database = model.getDatabase();

	// checks if username is taken and if it is not than it creates a user in the database
	// if username is taken it writes so to the console
	// It should probably write to the user via a dedicated <p> tag
	$scope.newAccount=function(){
		console.log("newAccount");
		var userName = document.getElementById("username").value;
		var passWord = document.getElementById("password").value;

		var ref = database.ref('users/'+userName);
		    ref.once("value").then(function(snapshot){
		            if(snapshot.exists()){
		            	console.log("Username is taken");
		            }
		            else{
		            	model.newAccount(userName, passWord);
		    					model.fetchData(userName);
									$location.path('/search');
		            }
		        });
	}

	// checks if the input matches an existing user in the database
	// if yes then writes to console
	// it should probably change things in model
	$scope.signIn = function(){
			console.log("signIn");
		    var userName = document.getElementById("username").value;
		    var passWord = document.getElementById("password").value;

		    if(passWord!="" && userName!=""){
			    var ref = database.ref('users/'+userName);
			    ref.once("value").then(function(snapshot){
			            if(snapshot.exists() && snapshot.val().password==passWord){
			            	model.fetchData(userName);
			                console.log("Model is updatad with your data");
											$location.path('/search');
			            }
			            else{
			                console.log("Wrong username or password");
			            }
			        });
			}
			else{
				console.log("You must enter both username and password");
			}
		}

});
