# M5Stack_JoyStick

X and Y direction with Push Switch Joystick.  
It uses the I2C communication.  


## wired(obniz, {scl, sda, vcc, gnd})

connect to the obniz Board.  
White, yellow, red and black wires correspond to scl, sda, vcc and gnd respectively.  

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5Stack_JoyStick", {scl:0, sda:1, vcc:2, gnd:3});
```


## [await] isPressedWait()
get the button state once.   

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5Stack_JoyStick", {scl:0, sda:1, vcc:2, gnd:3});

var isPressed = await joystick.isPressedWait();
if (isPressed) {
    console.log("Pressed!");
}
```


## [await] getXWait()
## [await] getYWait()

get X or Y angle once.

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5Stack_JoyStick", {scl:0, sda:1, vcc:2, gnd:3});
var x = await joystick.getXWait()
var y = await joystick.getYWait()
 
console.log("x:" + x + " y:" + y);
```