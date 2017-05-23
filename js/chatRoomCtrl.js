LoquiApp.controller('chatRoomCtrl', function($scope, model, $routeParams){

  //Creates right url for redirection, course code and room
  var path = $routeParams.room;
  var splitParams = path.split("-");
  var code = splitParams[0];
  var room = splitParams[1];
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('chatRoom/'+path);
  $scope.url = splitedUrl[0]

  $scope.courseID = code;
  $scope.room = room;

  // Gets all channels for this course
  $scope.allRooms = model.getRooms(code);

  //Gets course color
  var courseColor = model.getColorCourse(code);

  // Adds course to the recent list
  model.addToRecent(code, courseColor);

  //Checks if course if course is in favorites
  $scope.isFav = model.isFavoriteCourse(code);


  // This code if from a lab in this course and is used for creating different chatrooms
  //Object that holds application data and functions.
  var app = {};
  var totalMess = 0;

  var host = 'vernemq.evothings.com';
  var port = 8084;

  // Get info about user
  var name = model.getUserFullName();
  var userName = model.getUserName();
  var userColor = model.getColor();

  app.connected = false;//userName
  app.ready = false;

  $scope.sendMessage = function(event){
    var msg = document.getElementById("comment").value;
    document.getElementById("comment").value= "";

    //Everything handling the time
    var time = new Date();
    var timeDate = time.getDate();
    var timeMonth = time.getMonth();
    var timeHour = time.getHours();
    var timeMin = time.getMinutes();
    var timeSec = time.getSeconds();
    if (timeMin<10){
      timeMin = "0"+timeMin.toString();
    }else{
      timeMin = timeMin.toString();
    }
    if(timeSec<10){
      timeSec = "0"+timeSec.toString();
    }else{
      timeSec = timeSec.toString();
    }
    var actualTime = timeDate+"/"+timeMonth +" "+ timeHour.toString()+":"+timeMin+":"+timeSec;

    model.addMessange(code, room, userName, msg, actualTime, userColor);
  	var send = JSON.stringify({color: userColor, nick: userName, msg: msg, time: actualTime});
  	app.publish(send);
  }



  $scope.addFavorite = function(){
    model.addToFavorite(code, courseColor);
    $scope.isFav = model.isFavoriteCourse(code);
  }

  $scope.removeFavorite = function(){
    model.removeFromFavorite(code, courseColor);
    $scope.isFav = model.isFavoriteCourse(code);
  }

  $scope.newChannel = function(){
    var name=prompt("Please enter the name of the new channel");
    name = app.capitalize(name);
    var splitted = name.split(" ");
    name = "";
    for(var i = 0; i < splitted.length; i++ ){
      name = name + splitted[i];
    }
    name = $.trim(name);
      if (name!=null && name!=""){
        if ($scope.allRooms.length<5){
          for(i=0; i<$scope.allRooms.length; i++){
            if($scope.allRooms[i]==name){
              alert("That channel already exists!")
              return
            }
          }
          model.addChannel(code, name);
          var d = $.Deferred();
          var list = model.getRooms(code);
          $.when(d).done(function(listOfRooms) {
            $scope.$apply(function(){
              $scope.allRooms = listOfRooms;
            });
            console.log("satt rooms")
          })
          setTimeout(function() {
            d.resolve(list);
          }, 500);
        }
        else{
          alert("You already have 5 channels, you can't have any more");
        }
     }
     else if(name==""){
      alert("Since you didn't write any name, no channel was created");
     }
  }

  app.capitalize = function(string) {
      return string.replace(/^./, string[0].toUpperCase());
  }

  // On message arrive, do a sound
  app.beep = function(){
    var aSound = document.createElement('audio');
    aSound.setAttribute('src', 'beep.wav');
    aSound.play();
  }

  // When a message arrives, this funtion posts it on the messageSpace
  app.onMessageArrived = function(message) {
  	var o = JSON.parse(message.payloadString);
  	var text = document.createElement("p");
  	if(o.nick!=undefined){
      text.innerHTML= '<div class="messageBox" id="msgBox" style="background-color:' +o.color +'"><div class="row" id="messageHeader"><div class="col-xs-8"><div class="nameBox"><ul class="nav nav-pills"><li style="background-color:'+o.color+';border:none"><a style="color:black" href="index.html#/profile/' + o.nick + '">' + o.nick + '</a></li></ul></div></div><div class="col-xs-4"><div class="timeStamp">' + o.time + '</div></div></div><div>' + o.msg + '</div></div>';
			app.canvas.appendChild(text);
      if(o.nick!=userName){
        app.beep();
      }
  	}
    app.toBottom();
  }


  // Writes the old message
  app.loadOldMess = function(message) {

    var text = document.createElement("p");
    if(message.nick!=undefined){
      text.innerHTML= '<div class="messageBox" id="msgBox" style="background-color:'+ message.color+'"><div class="row" id="messageHeader"><div class="col-xs-8"><div class="nameBox"><ul class="nav nav-pills"><li style="background-color:'+message.color+';border:none"><a style="color:black" href="index.html#/profile/' + message.nick + '">' + message.nick + '</a></li></ul></div></div><div class="col-xs-4"><div class="timeStamp">' + message.time + '</div></div></div><div>' + message.msg + '</div></div>';
      app.canvas.appendChild(text);
    }
    app.toBottom();
  }

  // This function autoscrolls down to the bottom of the conversation
  app.toBottom = function(){
    var elem = document.getElementById('messageSpace');
    elem.scrollTop = elem.scrollHeight;
  }


  var oldMess = function(list){
    for(var i = 0; i < list.length; i++){
      app.loadOldMess(list[i]);
    }
  }

  // Function that loads old messages from database
  app.getOldMess = function(){
    model.getMessanges(code,room,oldMess);

  }

  app.initialize = function() {
    console.log("check app ready");
  	if (!app.ready) {
  		app.pubTopic = '/' + path + '/' + userName + '/evt'; // We publish to our own device topic
  		app.subTopic = '/' + path + '/' + '+/evt'; // We subscribe to all devices using "+" wildcard
  		app.setupCanvas();
  		app.setupConnection();
  		app.ready = true;
      app.getOldMess();
      app.toBottom();
    }
  }


  app.setupCanvas = function() {
    console.log("set canvas");
  	app.canvas = document.getElementById("messageSpace");
    console.log(app.canvas);

  	var btn = document.getElementById("sendButton");
  	btn.addEventListener( "click", app.sendMessage);
  	console.log("set up canvas");
  }


  app.setupConnection = function() {
  console.log("connection");
    	$scope.status = "Connecting to " + host + ":" + port + " as " + userName;
  	app.client = new Paho.MQTT.Client(host, port, userName);
  	app.client.onConnectionLost = app.onConnectionLost;
  	app.client.onMessageArrived = app.onMessageArrived;
  	var options = {
      useSSL: true,
      onSuccess: app.onConnect,
      onFailure: app.onConnectFailure,
    }
  	app.client.connect(options);
  }

  app.publish = function(json) {
  	message = new Paho.MQTT.Message(json);
  	message.destinationName = app.pubTopic;
  	app.client.send(message);
  }

  app.subscribe = function() {
  	app.client.subscribe(app.subTopic);
  	console.log("Subscribed: " + app.subTopic);
  }

  app.unsubscribe = function() {
  	app.client.unsubscribe(app.subTopic);
  	console.log("Unsubscribed: " + app.subTopic);
  }

  app.onConnect = function(context) {
  	app.subscribe();
  	$scope.status = "You are connected!";
  	app.connected = true;
  }

  app.onConnectFailure = function(e){
    console.log("Failed to connect: " + JSON.stringify(e));
  }

  app.onConnectionLost = function(responseObject) {
  	$scope.status ="Connection lost! Please reload the page..";
  	console.log("Connection lost: "+responseObject.errorMessage);
  	app.connected = false;
  }


  /* Set the width of the side navigation to 250px */
  $scope.openNav = function() {
  	    document.getElementById("mySidenav").style.width = "250px";
  }

  /* Set the width of the side navigation to 0 */
  $scope.closeNav = function() {
  	    document.getElementById("mySidenav").style.width = "0";
  }

  app.initialize();

});
