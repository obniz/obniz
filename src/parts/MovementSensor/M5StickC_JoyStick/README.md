# M5StickC_JoyStick

X and Y direction with Push Switch Joystick for M5StickC(JoyStick HAT).  
It uses the I2C communication.  


## wired(obniz, {scl, sda, vcc, gnd})

connect to the obniz Board.  
When using M5StickC, specify G0 pin as sda and G26 pin as scl.  
When using other devices, note that vcc is 3V3 pin.

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});
```


## [await] isPressedWait()
get the button state once.   

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});

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
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});

var x = await joystick.getXWait()
var y = await joystick.getYWait()
 
console.log("x:" + x + " y:" + y);
```