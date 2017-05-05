//model.js

LoquiApp.factory('model', function($resource){
	//Nu bara Mockups, ska hämtas från databasen senare
	this.database;
	this.username="admin";
	//this.recentCourses = [];
	this.recentCourses = ['DD1325','MD1454','DD4455'];
	this.favoriteCourses = ['SF1626'];
	//this.favoriteCourses = [];
	this.firstName = "Kalle";
	this.lastName = "Anka";
	this.nickName = "kalle.anka";
	this.age = 12;
	this.studying = "CL"
  	this.description = "I am a nice person and I like to code."


	// Initialize Firebase
	// Should only be done once for the whole app
	if(firebase.apps.length===0){
		console.log("init database in model.js");
		var config = {
		    apiKey: "AIzaSyDTtTEVNIbjTeGthtsq2nTk1aYTfotFBD4",
		    authDomain: "phoenix-eacb9.firebaseapp.com",
		    databaseURL: "https://phoenix-eacb9.firebaseio.com",
		    projectId: "phoenix-eacb9",
		    storageBucket: "phoenix-eacb9.appspot.com",
		    messagingSenderId: "451842193436"
		  };
		firebase.initializeApp(config);

		// THIS IS TEMPORARY
		this.database = firebase.database();
	}
	if(this.username=="admin"){
		// startvalues for testing; SHOULD BE DELETED LATER
		this.database.ref('users/admin').set({
		    username: "admin",
		    password: "1234",
		    firstName: "",
		    lastName: "",
		    nickName: ""
		});
		// startvalues for testing; SHOULD BE DELETED LATER
		this.database.ref('users/'+this.username+'/favorites/SF1626').set({
			courseName : 'SF1626'
		});
		this.database.ref('users/'+this.username+'/recent/DD1325').set({
			courseName : 'DD1325'
		});
		this.database.ref('users/'+this.username+'/recent/MD1454').set({
			courseName : 'MD1454'
		});
		this.database.ref('users/'+this.username+'/recent/DD4455').set({
			courseName : 'DD4455'
		});
		console.log('admin account sucessfully created');
	}


	this.getSchools = $resource('https://crossorigin.me/https://www.kth.se/api/kopps/v2/departments.sv.json',{},{
		get: {
			method: 'GET',
			isArray: true,
			transformResponse: function(data){
				var tmp =  angular.fromJson(data);
				return tmp;
			}
		}
	});

	this.getCourse = $resource('https://crossorigin.me/https://www.kth.se/api/kopps/v2/course/:query',{},{
		get: {
			method: 'GET',
			transformResponse: function(data){
				var tmp =  angular.fromJson(data);
				return {1:{
					code: tmp.code,
					name: tmp.title.en,
					url: tmp.href.en,
					level: tmp.level.en,
					info: tmp.info.sv}
				};
			}
		}
	});

	this.addToRecent = function(course){
		var index = this.favoriteCourses.indexOf(course);
		if (index > -1) {
    	this.favoriteCourses.splice(index, 1);
		}
		if(this.recentCourses.length > 2){
			this.recentCourses.splice(0, 1);
		}
		this.recentCourses.push(course);
	}

	this.getRecentCourses = function(){
		return this.recentCourses;
	}

	this.addToFavorite = function(course){
		
		course="DD2352";	// Hard coded; should be removed when this function can be called properly
		window.hyper.log("addToFavorite");
		var alreadyExists = false;
		for(var i=0;i<this.favoriteCourses.length;i++){
			if(course==this.favoriteCourses[i]){
				alreadyExists=true;
				break;
			}
		}
		if(alreadyExists==false){
			this.favoriteCourses.push(course);
			
			var ref = this.database.ref('users/'+this.username+'/favorites/'+course);
	    	ref.once("value").then(function(snapshot){
	            ref.set({
	            	courseName: course
	            });
        	});
		}
	}

	this.isFavoriteCourse = function(course){
		for(var i = 0; i < this.favoriteCourses.length; i++){
			if(this.favoriteCourses[i] == course){
				return true;
			}
		}
		return false;
	}

	this.removeFromFavorite = function(course){
		couse="DD2352";		// Hard coded; should be removed when this function can be called properly
		console.log("removeFromFavorite");
		var index = this.favoriteCourses.indexOf(course);
		if (index > -1) {
    		this.favoriteCourses.splice(index, 1);
		}

		var ref = this.database.ref('users/'+this.username+'/favorites');
    	ref.once("value").then(function(snapshot){
            if(snapshot.exists()){
            	console.log("remove from database");
            	snapshot.child(course).removeValue();
            	console.log("remove worked i think");
            }
            else{
            	console.log("course does not exist in the database, what is going on? :O");
            }
    	});		
	}

	this.getFavoriteCourses = function(){
		return this.favoriteCourses;
	}

	this.getUserFullName = function(){
		//Returns users name
		return this.firstName + " " + this.lastName;
	}

	this.getUserName = function(){
		//Returns users name
		return this.nickName;
	}

	// When logging in it fetches all available data from database 
	// and stores in model-attributes
	this.fetchData = function(userName){
		var ref = this.database.ref('users/'+userName);
		ref.once("value").then(function(snapshot){
	        if(snapshot.exists()){
	        	console.log("in snapshot 1");
	        	this.username = snapshot.val().username;
	        	this.firstName = snapshot.val().firstName;
	        	this.lastName = snapshot.val().lastName;
	        	this.nickName = snapshot.val().nickname;

	        	console.log("Data fetched from database");
	        }
	        else{
	            console.log("Somehow user does not exist, Error i guess :(");
	        }
	    });

		// Gets favorites from database
		ref = this.database.ref('users/'+userName+'/favorites');
		ref.once("value").then(function(snapshot){
			var list = [];
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					console.log(childsnapshot.key);
					list.push(childsnapshot.courseName);
				});
			}
			this.favoriteCourses=list;
		});

		// Gets recentCources from database
		ref = this.database.ref('users/'+userName+'/recent');
		ref.once("value").then(function(snapshot){
			var list = [];
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					console.log(childsnapshot.key);
					list.push(childsnapshot.courseName);
				});
			}
			this.recentCourses=list;
		});


		setFavoritesandRecentCourses = function(userName, db){

			var consoleLogFavorite="";
			var consoleLogRecent="";

			var ref = db.ref('users/'+userName+'/favorites');
			ref.once("value").then(function(snapshot){
				snapshot.forEach(function(childsnapshot){
					consoleLogFavorite+=", "+childsnapshot.key;
					this.favoriteCourses.push(childsnapshot.key);
				});
			});

			ref = db.ref('users/'+userName+'/recent');
			ref.once("value").then(function(snapshot){
				snapshot.forEach(function(childsnapshot){
					consoleLogRecent+=", "+ childsnapshot.key;
					this.recentCourses.push(childsnapshot.key);
				});
			});

			console.log("Favorites; "+consoleLogFavorite);
			console.log("Recent; "+consoleLogRecent);
		}
	}

	this.setDatabase = function(){
		this.database = firebase.database();
	}
	this.getDatabase = function(){
		return this.database;
	}
	this.newAccount = function(userName, passWord){
		this.database.ref('users/'+userName).set({
		    username: userName,
		    password: passWord,
		    firstName: "",
		    lastName: "",
		    nickName: "",
		    //recentCourses: "",
		    //favoriteCourses: ""  
		});


		// startvalues for testing; SHOULD BE DELETED LATER
		this.database.ref('users/'+userName+'/favorites/SF1626').set({
			courseName : 'SF1626'
		});
		this.database.ref('users/'+userName+'/recent/DD1325').set({
			courseName : 'DD1325'
		});
		this.database.ref('users/'+userName+'/recent/MD1454').set({
			courseName : 'MD1454'
		});
		this.database.ref('users/'+userName+'/recent/DD4455').set({
			courseName : 'DD4455'
		});
		this
		alert('account sucessfully created');
	}

	return this;
});