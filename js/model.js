//model.js

LoquiApp.factory('model', function($resource){

	var _this = this;

	this.database;
	this.username= "default";
	this.password = "default";
	this.recentCourses = ['DD1325','MD1454','DD4455'];
	this.favoriteCourses=['SF1626'];
	this.name= "default";
	this.age= "default";
	this.studying= "default";
  	this.description= "default";
  	this.fetchDataPromise="";
  	this.color = "#0099ff";
  	this.colorsToRandomFrom = ["#0099ff", "#00ffcc", "#cc99ff", "#ff66cc", "#ffff66", "#66ff66", 
  	"#99ccff", "#ffcccc", "#ffb3cc", "#ffb84d", "#33ffcc", "#b3ff1a", "#8cd9b3"];


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

		this.database.ref('users/'+this.username+'/recent/'+course).set({
			courseName: course
		});
	}

	this.getRecentCourses = function(){
		return this.recentCourses;
	}

	// Adds a course to favorites, also updates database
	this.addToFavorite = function(course){
		var alreadyExists = false;
		for(var i=0;i<this.favoriteCourses.length;i++){
			if(course==this.favoriteCourses[i]){
				window.hyper.log("addToFavorite; course already a favorite ");
				alreadyExists=true;
				break;
			}
		}
		if(alreadyExists==false){
			window.hyper.log("addToFavorite "+course);
			this.favoriteCourses.push(course);
			this.database.ref('users/'+this.username+'/favorites/'+course).set({
				courseName:course
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
		console.log("this.favoriteCourses: "+this.favoriteCourses);
		return this.favoriteCourses;
	}

	// When logging in it fetches all available data from database
	// and stores in model-attributes
	// the callback input is a function for changing paths to /search
	this.fetchData = function(userName, callback){
		var ref = this.database.ref('users/'+userName);
		if(this.fetchDataPromise==""){
			promise = ref.once("value", function(snapshot){
		        if(snapshot.exists()){
		        	var val = snapshot.val();
		        	_this.username = val.username;
					_this.password = val.password;
					_this.name = val.name;
					_this.age = val.age;
					_this.studying = val.studying;
			  		_this.description = val.description;
			  		_this.color = val.color;

				  	var list = [];
				  	snapshot.child("favorites").forEach(function(childsnapshot){
				  		list.push(childsnapshot.key);
				  	});
				  	_this.favoriteCourses=list;

				  	list = [];
				  	snapshot.child("recent").forEach(function(childsnapshot){
				  		list.push(childsnapshot.key);
				  	});
				  	_this.recentCourses=list;

					console.log("Model is updatad with your data");
					callback();
		        	return;
		        }
		        else{
		            console.log("Somehow user does not exist, Error i guess :(");
		        }
		    });
		}

	}

	// returns a list of messanges in a channel in this form
	// [sender, messange, timestamp], [sender, messange, timestamp], ..., ...]
	// callback is a function that does what is suposed to be done 
	// after the call to getMessanges() which has the list as input
	this.getMessanges = function(course, channel, callback){
		var ref = this.database.ref('messanges/'+course+'/'+channel);
		var list=[];
		ref.once("value").then(function(snapshot){
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					list.push([childsnapshot.val().sender, childsnapshot.val().messange, childsnapshot.val().time]);
				});

				callback(list);
			}
			else{
				console.log("this course has no messanges");
			}
		});
	}

	// Adds a messange to the database under messanges/course/channel
	this.addMessange = function(course, channel, sender, messange, timestamp){
		var ref = this.database.ref('messanges/'+course+'/'+channel);
		ref.push().set({
			sender:sender,
			messange:messange,
			time:timestamp
		});
	}
	

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
		    name: userName,
		    age:"",
		    description:"",
		    studying:"",
		    color:"#0099ff"
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

	this.getColor = function(){
		return this.color;
	}

	this.setFullName = function(name){
		this.name = name;
		this.database.ref('users/'+this.username+'/name').set(name);
	}

	this.setAge = function(age){
		this.age = age;
		this.database.ref('users/'+this.username+'/age').set(age);
	}

	this.setStudying = function(studying){
		this.studying = studying;
		this.database.ref('users/'+this.username+'/studying').set(studying);
	}

	this.setDescription = function(description){
		this.description = description;
		this.database.ref('users/'+this.username+'/description').set(description);
	}

	this.setColor = function(color){
		this.color = color;
		this.database.ref('users/'+this.username+'/color').set(color);
	}

	return this;
});
