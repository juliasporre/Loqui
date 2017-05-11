LoquiApp.controller('privateMessagesCtrl', function($scope, model, $routeParams){

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('privateMessages');
  $scope.url = splitedUrl[0];
  $scope.friend = $routeParams.userID; //The one you are sending private messages with

  var names = [$scope.friend, model.getUserName()];
  names.sort();
  var path = names[0] + '-' + names[1];

//Object that holds application data and functions.
var app = {};
var totalMess = 0;


var host = 'vernemq.evothings.com';
var port = 8084;

var name = model.getUserFullName();
var userName = model.getUserName();
var userColor = model.getColor();

app.connected = false;//userName
app.ready = false;

$scope.sendMessage = function(){
  var msg = document.getElementById("comment").value;
  document.getElementById("comment").value="";
	var send = JSON.stringify({color: userColor, nick: name + '(' + userName + ')', msg: msg, qos: 0, retained: true});
	app.publish(send);

}


app.onMessageArrived = function(message) {
	var o = JSON.parse(message.payloadString);
	var text = document.createElement("p");
	if(o.nick!=undefined){ //Ska läggas till i privata meddelanden
		var split = o.msg.split(" ")[0];
		var atUser;
		if (split[0]=="@"){
			atUser=split;
			if(atUser==('@' + userName) || o.nick == userName){
				text.innerHTML= o.nick + ": " + o.msg;
				app.canvas.appendChild(text);
			}
		}
		else{

      //Everything handling the time
      var time = new Date();
      var timeHour = time.getHours();
      var timeMin = time.getMinutes();
      var timeSec = time.getSeconds();
      if (timeMin<10){
      	timeMin = "0"+timeMin.toString()
      }
      else{
      	timeMin = timeMin.toString()
      }
      if(timeSec<10){
      	timeSec = "0"+timeSec.toString()
      }
      else{
      	timeSec = timeSec.toString()
      }
      var actualTime = timeHour.toString()+":"+timeMin+":"+timeSec;

      //Write out the arrived message
      var messNick = o.nick.split('(')[1].split(')')[0];
      o.nick = o.nick.split('(')[0];
      console.log(messNick);
			text.innerHTML= '<div class="messageBox" id="msgBox"><div class="row" id="messageHeader"><div class="col-xs-8"><div class="nameBox"><ul class="nav nav-pills"><li style="background-color:'+o.color+'"><a style="color:black" href="index.html#/profile/' + messNick + '">' + o.nick + '</a></li></ul></div></div><div class="col-xs-4"><div class="timeStamp">' + actualTime + '</div></div></div><div>' + o.msg + '</div></div>';

			app.canvas.appendChild(text);
		}
	}
  app.toBottom();
}

app.toBottom = function(){
  var elem = document.getElementById('messageSpace');
  elem.scrollTop = elem.scrollHeight;
}

app.initialize = function() {
  console.log("check app ready");
	if (!app.ready) {
		app.pubTopic = '/' + path + '/' + userName + '/evt'; // We publish to our own device topic
		app.subTopic = '/' + path + '/' + '+/evt'; // We subscribe to all devices using "+" wildcard
		app.setupCanvas();
		app.setupConnection();
		app.ready = true;
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
};

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

  $scope.goBack = function() {
    window.history.back();
  };

});
