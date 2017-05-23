//model.js

LoquiApp.factory('model', function($resource){

	var _this = this;

	this.database;
	this.username= "default";
	this.lowerUserName = this.username.toLowerCase();
	this.password = "default";
	this.recentCourses = [];
	this.favoriteCourses=[];
	this.name= "default";
	this.age= "default";
	this.studying= "default";
	this.description= "default";
	this.fetchDataPromise="";
	this.color = "#0099ff";
	this.colorsToRandomFrom = ["#0099ff", "#00ffcc", "#cc99ff", "#ff66cc", "#ffff66", "#66ff66",
	"#99ccff", "#ffcccc", "#ffb3cc", "#ffb84d", "#33ffcc", "#b3ff1a", "#8cd9b3"];
	this.privateConvos = [];

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


	var colorGenerator = function(code){
		var color;
		var letters = code.substring(0, 1);
		var letters2 = code.substring(0, 2);
		letters2 = letters2.toLowerCase();
		letters = letters.toLowerCase();
		console.log(letters)
		console.log(letters2)
		if(letters2=="dd"){
			color = "#ff3399"
		}
		else if(letters2=="sf"){
			color = "#ff1a1a"
		}
		else if(letters=="a"){
			color = "#cc66ff"
		}
		else if(letters=="b"){
			color = "#ffcc33"
		}
		else if(letters=="e"){
			color = "#9999ff"
		}
		else if(letters=="m"){
			color = "#e60000"
		}
		else if(letters=="i"){
			color = "#4dffb8"
		}
		else if(letters=="k"){
			color = "#ffff80"
		}
		else if(letters=="h"){
			color = "#33ff33"
		}
		else if(letters=="l"){
			color = "#ff6633"
		}
		else if(letters=="s"){
			color = "#0099e6"
		}
		else{
			color="#ff751a"
		}
		return color
	}

	this.getCourse = $resource('https://crossorigin.me/https://www.kth.se/api/kopps/v2/course/:query',{},{
		get: {
			method: 'GET',
			transformResponse: function(data){
				var tmp =  angular.fromJson(data);
				color = colorGenerator(tmp.code);
				return {1:{
					code: tmp.code,
					name: tmp.title.en,
					url: tmp.href.en,
					level: tmp.level.en,
					info: tmp.info.sv,
					color: color}
				};
			}
		}
	});

	this.getColorCourse = function(code){
		return colorGenerator(code);
	}

	function containsObject(obj, list) {
	    var i;
	    for (i = 0; i < list.length; i++) {
	        if (list[i].course === obj.course) {
	            return i;
	        }
	    }

	    return -1;
	}

	// Adds a course to recentCourses, also updates database
	this.addToRecent = function(course, color){
		courseObject = {courseName:course, color:color};
		var index = containsObject(courseObject,this.recentCourses);
		if (index > -1) {
    	this.recentCourses.splice(index, 1);
		}
		if(this.recentCourses.length > 2){
			this.recentCourses.splice(0, 1);
		}
		this.recentCourses.splice(0, 0, courseObject);
		this.database.ref('users/'+this.lowerUserName+'/recent/'+course).set({
			courseName: course,
			color: color
		});
	}





	this.getRecentCourses = function(){
		return this.recentCourses;
	}

	// Adds a course to favorites, also updates database
	this.addToFavorite = function(courseCode, color){
		var alreadyExists = false;
		for(var i=0;i<this.favoriteCourses.length;i++){
			if(courseCode==this.favoriteCourses[i]){
				window.hyper.log("addToFavorite; course already a favorite ");
				alreadyExists=true;
				break;
			}
		}
		if(alreadyExists==false){
			window.hyper.log("addToFavorite "+courseCode);
			courseObject = {courseName:courseCode, color:color};
			this.favoriteCourses.push(courseObject);
			this.database.ref('users/'+this.lowerUserName+'/favorites/'+courseCode).set({
				courseName:courseCode,
				color:color
			});
		}
	}

	this.isFavoriteCourse = function(course){
		for(var i = 0; i < this.favoriteCourses.length; i++){
			if(this.favoriteCourses[i].courseName == course){
				return true;
			}
		}
		return false;
	}

	this.removeFromFavorite = function(course, color){
		courseObject = {courseName:course, color:color};
		console.log("removeFromFavorite "+course);
		var index = containsObject(courseObject, this.favoriteCourses);
		if (index > -1) {
    		this.favoriteCourses.splice(index, 1);
		}
		this.database.ref('users/'+this.username+'/favorites/'+course).remove();
	}

	this.getFavoriteCourses = function(){
		console.log("this.favoriteCourses: "+this.favoriteCourses);
		return this.favoriteCourses;
	}

	/*
	this.getFriendName = function(lowerUserName){
		var friend = [];
		var lowerUserName = lowerUserName.toLowerCase();
		var ref = this.database.ref('users/'+lowerUserName);
		ref.once("value", function(snapshot){
			if(snapshot.exists()){
				snap = snapshot.val();
				console.log(snap)
				friend.push(snap.username);

			}
		})
		return friend;

	}*/

	// When logging in it fetches all available data from database
	// and stores in model-attributes
	// the callback input is a function for changing paths to /search
	this.fetchData = function(userName, callback){
		var lowerUserName = userName.toLowerCase();
		var ref = this.database.ref('users/'+lowerUserName);
		if(this.fetchDataPromise==""){
			promise = ref.once("value", function(snapshot){
	    	if(snapshot.exists()){
	      	var val = snapshot.val();
        	_this.username = val.username;
        	_this.lowerUserName = _this.username.toLowerCase();
					_this.password = val.password;
					_this.name = val.name;
					_this.age = val.age;
					_this.studying = val.studying;
	  			_this.description = val.description;
	  			_this.color = val.color;

			  	var list = [];
			  	snapshot.child("favorites").forEach(function(childsnapshot){
				  	list.push(childsnapshot.val());
			  	});
			  	_this.favoriteCourses=list;
					var list = [];
					snapshot.child("convos").forEach(function(childsnapshot){
						list.push(childsnapshot.val());
					});
					
					_this.privateConvos = list;
			  	list = [];
			  	snapshot.child("recent").forEach(function(childsnapshot){
			  		list.push(childsnapshot.val());
			  	});
			  	_this.recentCourses=list;

					console.log("Model is updated with your data");
					callback();
	        return;
				}else{
	      	console.log("Somehow user does not exist, Error i guess :(");
				}
	    });
		}
	}

	// creates a list of messanges in a channel in this form
	// [sender, messange, timestamp], [sender, messange, timestamp], ..., ...]
	// callback is a function that does what is suposed to be done
	// after the call to getMessanges() which has the list as input
	this.getMessanges = function(course, channel, callback){
		var ref = this.database.ref('messanges/'+course+'/'+channel);
		var list=[];
		ref.once("value").then(function(snapshot){
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					var val = childsnapshot.val();
					list.push(val);
				});

				callback(list);
			}else{
				console.log("this course has no messanges");
			}
		});
	}

	// creates a list of messanges in a channel in this form
	// [sender, messange, timestamp], [sender, messange, timestamp], ..., ...]
	// callback is a function that does what is suposed to be done
	// after the call to getPrivateMessanges() which has the list as input
	this.getPrivateMessanges = function(path, callback){
		var ref = this.database.ref('users/privateMessanges/'+path);
		var list=[];
		ref.once("value").then(function(snapshot){
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					var val = childsnapshot.val();
					list.push(val);
				});
				callback(list);
			}else{
				console.log("this course has no messanges");
			}
		});
	}

	// Adds a messange to the database under messanges/course/channel
	this.addMessange = function(course, channel, sender, messange, timestamp,color){
		var ref = this.database.ref('messanges/'+course+'/'+channel);
		ref.push().set({
			nick:sender,
			msg:messange,
			time:timestamp,
			color: color
		});
	}

	this.addChannel = function(course, channelName){
		var ref = this.database.ref('messanges/'+course+'/'+channelName);
		ref.push().set({
			nick:"Admin",
			msg:"Welcome to this new channel!",
			time: "admin",
			color: "white"
		});
	}


	this.getRooms = function(course){
		var roomList = [];
		var ref = this.database.ref('messanges/'+course);
		ref.once("value").then(function(snapshot){
			if(snapshot.exists()){
				console.log("NY snapshot")
				var val = snapshot.val()
				console.log(val)
				for (var room  in val){
					roomList.push(room);
				}
			}
			else{
				console.log("adding general since it does not exist")
				_this.addChannel(course, "General");
				roomList = _this.getRooms(course);
			}
		});
		return roomList;
	}



	// adds a private messange to the database
	// for messanges to be fetched for both parts the messanges
	// has to be saved for both users
	this.addPrivateMessang = function(path, sender, messange, timestamp, color){
		var ref = this.database.ref('users/privateMessanges/'+path);
		ref.push().set({
			nick: sender,
			msg:messange,
			time:timestamp,
			color: color
		});
	}


	this.addPrivateMessangeConv = function(otherUser){
		this.database.ref('users/'+this.lowerUserName+'/convos/'+otherUser.username).set({
			username: otherUser.username,
			name: otherUser.name,
			color: otherUser.color
		});
		_this.privateConvos.push(otherUser);
	}

	this.addOtherPrivateMessangeConv = function(other){
		this.database.ref('users/'+other.username+'/convos/'+_this.username).set({
			username: _this.username,
			name: _this.name,
			color: _this.color
		});

	}

	this.getPrivateMessangeConv = function(){
		return this.privateConvos;
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
		var lowerUserName = userName.toLowerCase();
		this.database.ref('users/'+lowerUserName).set({
		    username: userName,
		    password: passWord,
		    name: userName,
		    age:"",
		    description:"",
		    studying:"",
		    color:"#0099ff"
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
		this.database.ref('users/'+this.lowerUserName+'/name').set(name);
	}

	this.setAge = function(age){
		this.age = age;
		this.database.ref('users/'+this.lowerUserName+'/age').set(age);
	}

	this.setStudying = function(studying){
		this.studying = studying;
		this.database.ref('users/'+this.lowerUserName+'/studying').set(studying);
	}

	this.setDescription = function(description){
		this.description = description;
		this.database.ref('users/'+this.lowerUserName+'/description').set(description);
	}

	this.setColor = function(color){
		this.color = color;
		this.database.ref('users/'+this.lowerUserName+'/color').set(color);
	}

	// This function fetches all users who are searching for lunchpartners
	// and adds the user to the database so other users can find them
	// the function removeFromSearch must be called in order to remove a user
	this.searchForPartner = function(lunchType){
		var ref = _this.database.ref('lunch/'+lunchType.toString());
		var list= [];
		ref.once("value", function(snapshot){
			if(snapshot.exists()){
				snapshot.forEach(function(childsnapshot){
					child = childsnapshot.val();

					if(child.user==_this.username){
						_this.removeFromSearch(lunchType);
					}
					else{
						list.push([child.user, child.color]);
					}
				});
				//adds the user to users searching for lunchpartners
				var lowerUserName = _this.username.toLowerCase();
				_this.database.ref('lunch/'+lunchType.toString()+'/'+lowerUserName).set({
					user:_this.username,
					color:_this.color, 
					matchname: false, //here a matched partner will input his name so you know its a match
					matchcolor: "white"
				});
			}
			else{
				//adds the user to users searching for lunchpartners
				var lowerUserName = _this.username.toLowerCase();
				_this.database.ref('lunch/'+lunchType.toString()+'/'+lowerUserName).set({
					user:_this.username,
					color:_this.color,
					matchname: false,
					matchcolor: "white"
				});

				console.log("No other users are searching for lunchpartners" + _this.username);
			}

		});
		return list;
	}

	//sends to the chosen partner its new partner
	this.choosePartner = function(lunchType, partnerObject){
		var lowerPartner = partnerObject[0].toLowerCase();
		_this.database.ref('lunch/'+lunchType.toString()+'/'+lowerPartner).set({
			user:partnerObject[0],
			color:partnerObject[1], 
			matchname: _this.username, //here a matched partner will input his name so you know its a match
			matchcolor: _this.color
		});
	}

	// Removes the user from the database for searching for lunch partner
	this.removeFromSearch = function(lunchType){
		var lowerUserName = _this.username.toLowerCase();
		_this.database.ref('lunch/'+lunchType.toString()+'/'+lowerUserName).remove();
	}

	//checks if someone else has putted themself in your spot in the database, then they have chosen you
	this.checkIfMatched = function(lunchType){
		list = []
		var lowerUserName = _this.username.toLowerCase();
		var ref = _this.database.ref('lunch/'+lunchType.toString()+'/'+lowerUserName);
		ref.once("value", function(snapshot){
			if(snapshot.exists()){
				
				snap = snapshot.val()
				if (snap.matchname!=false){
					console.log("ref är inte false utan är någon! " + snap.matchname)
					
					list.push(snap.matchname);
					list.push(snap.matchcolor)
					console.log(list)
					
				}
				else{
					console.log("ref är false så vi returnar en tom lista")
					
				}
			}

		});
		return list;
	}

	return this;
});
