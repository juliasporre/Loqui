LoquiApp.controller('privateMessagesCtrl', function($scope, model, $routeParams){

  //Creates right url for redirection
  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];

  // Get friends name
  $scope.friend = $routeParams.userID;

  // Generates the right name for the chat room, the usernames with "-" in alphabetic order
  // Tehreby it is the same for the users
  var names = [$scope.friend.toLowerCase(), model.getUserName().toLowerCase()];
  names.sort();
  var path = names[0] + '-' + names[1];

// This code if from a lab in this course and is used for creating different chatrooms
//Object that holds application data and functions.
  var app = {};
  var totalMess = 0;


  var host = 'vernemq.evothings.com';
  var port = 8084;

  var name = model.getUserFullName();
  var userName = model.getUserName();
  var userColor = model.getColor();

  app.connected = false;
  app.ready = false;

  $scope.sendMessage = function(){
    var msg = document.getElementById("comment").value;
    document.getElementById("comment").value="";

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

    model.addPrivateMessang(path, userName,msg, actualTime, userColor);
  	var send = JSON.stringify({color: userColor, nick: userName, msg: msg, time: actualTime});
  	app.publish(send);

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
  	if(o.nick!=undefined){ //Ska läggas till i privata meddelanden

  		text.innerHTML= '<div class="messageBox" id="msgBox" style="background-color:' +o.color +'"><div class="row" id="messageHeader"><div class="col-xs-8"><div class="nameBox"><ul class="nav nav-pills"><li style="background-color:'+o.color+';border:none"><a style="color:black" href="index.html#/profile/' + o.nick + '">' + o.nick + '</a></li></ul></div></div><div class="col-xs-4"><div class="timeStamp">' + o.time + '</div></div></div><div>' + o.msg + '</div></div>';
  		app.canvas.appendChild(text);
      if(o.nick!=userName){
        app.beep();
      }
  	}
    app.toBottom();
  }

  // This function autoscrolls down to the bottom of the conversation
  app.toBottom = function(){
    var elem = document.getElementById('messageSpace');
    elem.scrollTop = elem.scrollHeight;
  }


  // Writes the old message
  app.loadOldMess = function(message) {
    var text = document.createElement("p");
    if(message.nick!=undefined){
      text.innerHTML= '<div class="messageBox" id="msgBox" style="background-color:'+ message.color+'"><div class="row" id="messageHeader"><div class="col-xs-8"><div class="nameBox"><ul class="nav nav-pills"><li style="background-color:'+message.color+';border:none""><a style="color:black" href="index.html#/profile/' + message.nick + '">' + message.nick + '</a></li></ul></div></div><div class="col-xs-4"><div class="timeStamp">' + message.time + '</div></div></div><div>' + message.msg + '</div></div>';
      app.canvas.appendChild(text);
    }
    app.toBottom();
  }

  var oldMess = function(list){
    for(var i = 0; i < list.length; i++){
      app.loadOldMess(list[i]);
    }
  }

  app.getOldMess = function(){
    model.getPrivateMessanges(path,oldMess);

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

  // go to previous
  $scope.goBack = function() {
    window.history.back();
  }

});
