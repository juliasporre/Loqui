LoquiApp.controller('landingCtrl', function($scope, model){
	
	// Initialize Firebase
	// Should only be done once for the whole app
	if(firebase.apps.length===0){
		console.log("init database");
		var config = {
		    apiKey: "AIzaSyDTtTEVNIbjTeGthtsq2nTk1aYTfotFBD4",
		    authDomain: "phoenix-eacb9.firebaseapp.com",
		    databaseURL: "https://phoenix-eacb9.firebaseio.com",
		    projectId: "phoenix-eacb9",
		    storageBucket: "phoenix-eacb9.appspot.com",
		    messagingSenderId: "451842193436"
		  };
		firebase.initializeApp(config);
		model.setDatabase();
	}

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
			            	model.fetchData(username);
			                console.log("Model is updatad with your data");
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
