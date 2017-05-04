LoquiApp.controller('chatRoomCtrl', function($scope, model, $routeParams){



  var path = $routeParams.room;
  var splitParams = path.split("-");
  var code = splitParams[0];
  var room = splitParams[1];

  var urlOrg = window.location.href;
  var splitedUrl = urlOrg.split('chatRoom/'+path);
  $scope.url = splitedUrl[0]

  $scope.courseID = code;
  $scope.room = room;

// A Painter application that uses MQTT to distribute draw events
// to all other devices running this app.

//Object that holds application data and functions.
var app = {};
var totalMess = 0;


var host = 'vernemq.evothings.com';
var port = 8084;

var name = model.getUserFullName();
var nick = model.getUserName();

app.connected = false;
app.ready = false;

$scope.sendMessage = function(){
  var msg = document.getElementById("comment").value;
  document.getElementById("comment").value="";
	var send = JSON.stringify({nick: name, msg: msg});
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
			if(atUser==('@'+nick) || o.nick == nick){
				text.innerHTML= o.nick + ": " + o.msg;
				app.canvas.appendChild(text);
			}
		}
		else{
      //console.log(new Date());
      //var time = JSON.stringify(new Date()).split("GTM")[0];
      var time = new Date();
			text.innerHTML= '<div class="messageBox" id="msgBox"><div class="col-xs-8"><div class="nameBox">' + o.nick + '</div></div><div class="col-xs-4"><div class="timeStamp">' + time + '</div></div><div>' + o.msg + '</div></div>';

			app.canvas.appendChild(text);

      //Trying to autoscroll
      //console.log(app.canvas)
      //totalMess += 1;
      //console.log(totalMess*40);
      //app.canvas.animate({scrollTop: totalMess*40});
		}
	}
}

app.initialize = function() {
  console.log("check app ready");
	if (!app.ready) {
		app.pubTopic = '/' + path + '/' + nick + '/evt'; // We publish to our own device topic
		app.subTopic = '/' + path + '/' + '+/evt'; // We subscribe to all devices using "+" wildcard
		app.setupCanvas();
		app.setupConnection();
		app.ready = true;
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
  	$scope.status = "Connecting to " + host + ":" + port + " as " + nick;
	app.client = new Paho.MQTT.Client(host, port, nick);
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

});
