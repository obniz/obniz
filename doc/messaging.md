# Messaging
obniz can receive and transfer data from HTTP request.
Using this function you can also send data from one obniz to another. 



## API - obniz messaging
You can send a message to an obniz by calling the REST API.

```
GET https://obniz.io/obniz/{obniz_id}/message?data={what you want to send}
```

For example, send "move" text message to obniz 0000-0000 as below.
```
GET https://obniz.io/obniz/0000-0000/message?data=move
```

And obniz 0000-0000 will get the message as long as it is online.
You can do something on that event.
404 is returned when obniz is not online.

```Javascript
// Example
obniz.onconnect = function() {
  var motor = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

  motor.angle(0);
  obniz.onmessage = function(message, from) {
    if (message === "move") {
      motor.angle(85);
    }
  };
}
```

You can do this with POST method to send to multiple destinations.
```
POST https://obniz.io/obniz/message
```
Parameters

- to:  destination separated by "," 
- data: message

## obniz - obniz messaging
Below is an example of pressing one button to move the hands of 10 robots aroudn the world simultaneously.
First, prepare an obniz with one button connected, and send a message to 10 obniz when that button is pressed.
```Javascript
// Example
obniz.onconnect = function(){
    var button = obniz.wired("Button",  {signal:0, gnd:1});

    button.onchange = function(){
      var targets = [
        "1234-1231",
        "1234-1232",
        "1234-1233",
        "1234-1234",
        "1234-1235",
        "1234-1236",
        "1234-1237",
        "1234-1238",
        "1234-1239",
        "1234-1230"];

      obniz.message(targets, "pressed");
    };
 }
```
obniz ids written in targets are the destinations. and "pressed" is message.

The 10 obniz will handle this message with onmessage function. With that function, servomotor attached to each obniz will be moved in response to the message.
```Javascript
// Example
obniz.onconnect = function() {
  var motor = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

  motor.angle(0);
  obniz.onmessage = function(message, from) {
    if (message === "pressed") {
      motor.angle(85);
    }
  };
}
```