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
		this.database = firebase.database();
		if(this.username=="admin"){
			this.database.ref('users/admin').set({
			    username: "admin",
			    password: "1234",
			    firstName: "",
			    lastName: "",
			    nickName: ""
			});
			this.database.ref('users/'+this.username+'/favorite/SF1626').set({
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
			//alert('admin account sucessfully created');
		}
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
		var index = this.favoriteCourses.indexOf(course);
		if (index > -1) {
    		this.favoriteCourses.splice(index, 1);
		}

		var ref = this.database.ref('users/'+this.username+'/favorites');
    	ref.once("value").then(function(snapshot){
            if(snapshot.exists()){
            	snapshot.child(course).removeValue();
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
			            	this.username = snapshot.val().username;
			            	this.firstName = snapshot.val().firstName;
			            	this.lastName = snapshot.val().lastName;
			            	this.nickName = snapshot.val().nickname;

			            	//Needs to be formated to array from string
			            	setFavoritesandRecentCourses(userName);
			            	this.recentCourses = snapshot.val().recentCourses;
			            	this.favoriteCourses = snapshot.val().favoriteCourses;

			            	console.log("Data fetched from database");
			            }
			            else{
			                console.log("Somehow user does not exist, Error i guess :(");
			            }
			        });

		setFavoritesandRecentCourses = function(userName){
			var ref = this.database.ref('users/'+userName+'/favorites');
			ref.once("value").then(function(snapshot){
				snapshot.forEach(function(childsnapshot){
					this.favoriteCourses.push(childsnapshot.key);
				});
			});
			ref = this.database.ref('users/'+userName+'/recent');
			ref.once("value").then(function(snapshot){
				snapshot.forEach(function(childsnapshot){
					this.recentCourses.push(childsnapshot.key);
				});
			});
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


		// startvalues for testing
		this.database.ref('users/'+userName+'/favorite/SF1626').set({
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
