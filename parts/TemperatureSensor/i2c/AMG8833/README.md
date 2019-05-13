# Thermal Camera Sensor - AMG8833
Infrared Arraied sensor AMG833 Library.
It has 8x8 (0 to 80 degree in celsius) temperature sensors.

![](./image.jpg)

Some maker produce AMG833 moduels.
Above is Adafruit's one.

![](./gif.gif)


## wired(obniz,  {[vin, gnd, sda, scl, address]} )
connect a sensor.
AMG833 is 3.3v. This library `vin` supply 5v. Pay attention when you are using not Adafruit module.

If you are using Adafruit module, Please supply vin from two or more io. See below example. io0 and io4 is used for supplying vin.

address is optional. Default is 0x69. If your module is configred to 0x68, please specify 0x68.

```javascript
// Javascript Example
obniz.io4.output(true);
var grideye = obniz.wired("AMG8833", {vcc:0, gnd:1, sda:2, scl:3, address:0x69});
```


## [await] getAllPixWait()
Getting all of output as numeric array.
Value is celcius degree within 0 to 80.
```javascript
// Javascript Example
var grideye = obniz.wired("AMG8833", {vcc:0, gnd:1, sda:2, scl:3});
var temp = await grideye.getAllPixWait();
console.log('temperature:' + temp);
```

Drawing with canvas is easy.

```javascript
<canvas id="canvas" width="300" height="300"></canvas>

and

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

for(let x=0;x<8;x++) {
  for(let y=0;y<8;y++) {
    var temp = temps[x*8+y];
    var h = -80+(temp-29)*25
    ctx.fillStyle="hsl("+h+", 100%, 50%)";
    ctx.fillRect(width/8*x,height/8*y,width/8,height/8);
  }
}
```

![](./normalresl.png)

By using opencv resolution up convert, You can get high-resolution image.

```javascript
<canvas id="canvas" width="8" height="8"></canvas>
<canvas id="canvas_highr" width="100" height="100"></canvas>

and

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

for(let x=0;x<8;x++) {
  for(let y=0;y<8;y++) {
    var temp = temps[x*8+y];
    var h = -80+(temp-29)*25
    ctx.fillStyle="hsl("+h+", 100%, 50%)";
    ctx.fillRect(width/8*x,height/8*y,width/8,height/8);
  }
}

let src = cv.imread('canvas');
let dst = new cv.Mat();
let dsize = new cv.Size(300, 300);
cv.resize(src, dst, dsize, 0, 0, cv.INTER_CUBIC);
cv.imshow('canvas_highr', dst);
src.delete(); dst.delete();
```

## [await] getOnePixWait(pixel)
Getting only one pixel. Specify pixel as a number 0 to 63.

```javascript
// Javascript Example
var grideye = obniz.wired("AMG8833", {vcc:0, gnd:1, sda:2, scl:3});
var temp = await grideye.getOnePixWait(10);
console.log('temperature:' + temp);
```
