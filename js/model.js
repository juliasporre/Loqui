//model.js

LoquiApp.factory('model', function($resource){

	var _this = this;

	this.database;
	this.username= "default";
	this.password = "default";
	this.recentCourses = ['DD1325','MD1454','DD4455'];
	this.favoriteCourses = ['SF1626'];
	this.name= "default";
	this.age= "default";
	this.studying= "default";
  	this.description= "default";


	// Initialize Firebase
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

	// Adds a course to recentCourses, also updates database
	this.addToRecent = function(course){
		var index = this.favoriteCourses.indexOf(course);
		if (index > -1) {
    	this.favoriteCourses.splice(index, 1);
		}
		if(this.recentCourses.length > 2){
			this.recentCourses.splice(0, 1);
		}
		this.recentCourses.push(course);

		var ref = this.database.ref('users/'+this.username+'/recent/'+course);
    	ref.once("value").then(function(snapshot){
            ref.set({
            	courseName: course
            });
    	});

	}

	this.getRecentCourses = function(){
		return this.recentCourses;
	}

	// Adds a course to favorites, also updates database
	this.addToFavorite = function(course){
		window.hyper.log("addToFavorite "+course);
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
		console.log("removeFromFavorite "+course);
		var index = this.favoriteCourses.indexOf(course);
		if (index > -1) {
    		this.favoriteCourses.splice(index, 1);
		}
		this.database.ref('users/'+this.username+'/favorites/'+course).remove();
	}

	this.getFavoriteCourses = function(){
		return this.favoriteCourses;
	}

	// When logging in it fetches all available data from database
	// and stores in model-attributes
	this.fetchData = function(userName){
		var ref = this.database.ref('users/'+userName);
		ref.once("value").then(function(snapshot){
	        if(snapshot.exists()){
	        	_this.username = snapshot.val().username;
				_this.password = snapshot.val().password;
				_this.name = snapshot.val().name;
				_this.age = snapshot.val().age;
				_this.studying = snapshot.val().studying;
		  		_this.description = snapshot.val().description;

			  	var list = [];
			  	//console.log("fetch favorites");
			  	snapshot.child("favorites").forEach(function(childsnapshot){
			  		//console.log(childsnapshot.key);
			  		list.push(childsnapshot.courseName);
			  	});
			  	this.favoriteCourses=list;

			  	list = [];

			  	//console.log("fetch recent");
			  	snapshot.child("recent").forEach(function(childsnapshot){
			  		//console.log(childsnapshot.key);
			  		list.push(childsnapshot.courseName);
			  	});
			  	this.recentCourses=list;
	        	console.log("Data fetched from database");
	        }
	        else{
	            console.log("Somehow user does not exist, Error i guess :(");
	        }
	    });
	}

	/*
	this.getMessanges = function(course){
		var ref = this.database.ref('messanges/'+course);
		var list=[];
		ref.once("value").then(function(snapshot){
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					list.push(childsnapshot.);
				});
			}
			else{
				console.log("this course has no messanges");
			}
		});
	}

	this.setMessange = function(course, channel, sender, messange, timestamp){
		var ref = this.database.ref('messanges/'+course+'/'+channel);
	}
	*/

	this.setDatabase = function(){
		this.database = firebase.database();
	}

	this.getDatabase = function(){
		return this.database;
	}

	// creates a new user in database with empty attributes
	// that the uses fill in inside the app
	this.newAccount = function(userName, passWord){
		this.database.ref('users/'+userName).set({
		    username: userName,
		    password: passWord,
		    name: "",
		    age:"",
		    description:"",
		    studying:""
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
		alert('account sucessfully created');
	}


	this.getAge = function(){
		return this.age;
	}

	this.getUserFullName = function(){
		//Returns users name
		return this.name;
	}

	this.getUserName = function(){
		//Returns users name
		return this.username;
	}

	this.getStudying = function(){
		return this.studying;
	}

	this.getDescription = function(){
		return this.description;
	}

	this.setFullName = function(name){
		this.name = name;
		this.database.ref('users/'+this.username+'/name').set(name);
		//this.setData();
	}

	this.setAge = function(age){
		this.age = age;
		this.database.ref('users/'+this.username+'/age').set(age);
		//this.setData();
	}

	this.setStudying = function(studying){
		this.studying = studying;
		this.database.ref('users/'+this.username+'/studying').set(studying);
		//this.setData();
	}

	this.setDescription = function(description){
		this.description = description;
		this.database.ref('users/'+this.username+'/description').set(description);
		//this.setData();
	}

	/*
	this.setData = function(){
		this.database.ref('users/'+this.username).set({
			name: _this.name,
			username: _this.username,
			password: _this.password,
			age: _this.age,
			studying: _this.studying,
			description: _this.description
		});
	}*/

	return this;
});
