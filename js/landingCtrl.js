LoquiApp.controller('landingCtrl', function($scope, model){
	
	// Initialize Firebase
	// Should only be done once for the whole app
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

	// checks if username is taken and if it is not than it creates a user in the database
	// if username is taken it writes so to the console
	// It should probably write to the user via a dedicated <p> tag
	$scope.newAccount=function(){
		console.log("newAccount");
		var database = firebase.database();
		var userName = document.getElementById("username").value;
		var passWord = document.getElementById("password").value;
		
		console.log("createAccount");

	    if(checkUser(userName, passWord)==false){
			database.ref('users/'+userName).set({
		        password: passWord,
		        username: userName
		    });
		    alert('account sucessfully created');
	    }
	    else{
	        console.log("Username is taken");
	    }

	    // Checks is the username exists in the database of users
	    function checkUser(username, password){
			console.log("checkUser");

			// Takes a snapshot of database data at 'users/username' and
			// checks if something is there. returns true if yes and false if no
		    var ref = database.ref('users/'+username.value);
		    ref.once("value").then(function(snapshot){
		            if(snapshot.exists()){
		            	console.log("checkuser; true" );
		                return true;
		            }
		            else{
		            	console.log("checkuser; false" );
		                return false;
		            }
		        });
		}
	}

	// checks if the input matches an existing user in the database
	// if yes then writes to console
	// it should probably change things in model
	$scope.signIn = function(){
			console.log("signIn");
			var database = firebase.database();
		    var userName = document.getElementById("username").value;
		    var passWord = document.getElementById("password").value;

		    if(passWord!="" && userName!=""){
			    var ref = database.ref('users/'+userName);
			    ref.once("value").then(function(snapshot){

			            if(snapshot.exists() && snapshot.val().password==passWord){
			                console.log("User exists");
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
