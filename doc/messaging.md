# Messaging
obniz can receive and transfer datas from HTTP request to an obniz.



## API - obniz messaging
you can send a message to an obniz by calling the REST API.

```
GET https://obniz.io/obniz/{obniz_id}/message?data={what you want to send}
```

for example send "move" text message to obniz 0000-0000
```
GET https://obniz.io/obniz/0000-0000/message?data=move
```

And then, obniz 0000-0000 will get the message.
You can do something on that event.
404 return when obniz is not online.

```Javascript
// Example
obniz.onconnect = function() {
  var motor = obniz.wired("ServoMotor", 0 , 1, 2);

  motor.angle(0);
  obniz.onmessage = function(message, from) {
    if (message === "move") {
      motor.angle(85);
    }
  };
}
```

You can do with POST method. It accept multiple destinations.
```
POST https://obniz.io/obniz/message
```
Parameters

- to:  destionation separated "," 
- data: message

## obniz - obniz messaging
For example, press one button to move 10 robot's hand.
First prepare obniz with one button connected. and send a message to 10 obniz when button pressed.
```Javascript
// Example
obniz.onconnect = function(){
    var button = Parts("Button");
    button.wired(obniz, 0 , 1);

    button.onChange(function(){
      var targets = [
        "1234-1234-1231",
        "1234-1234-1232",
        "1234-1234-1233",
        "1234-1234-1234",
        "1234-1234-1235",
        "1234-1234-1236",
        "1234-1234-1237",
        "1234-1234-1238",
        "1234-1234-1239",
        "1234-1234-1230"];

      obniz.message(targets, "pressed");
    });
 }
```
targets is destination. and "pressed" is message.

10 obniz will handle this message on onmessage function. In that function, move servomotor regarding the message.
```Javascript
// Example
obniz.onconnect = function() {
  var motor = obniz.wired("ServoMotor", 0 , 1, 2);

  motor.angle(0);
  obniz.onmessage = function(message, from) {
    if (message === "pressed") {
      motor.angle(85);
    }
  };
}
```