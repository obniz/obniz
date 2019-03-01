# MEMS Thermal Sensor - D6T44L
MEMS Thermal Sensor D6T44L Library.
It has 4x4 (5 to 50 degree in celsius) temperature sensors.

![](./image.jpg)

## wired(obniz,  { [ gnd, vcc, sda, scl] } )
connect a sensor.

```javascript
// Javascript Example
var d6t = obniz.wired('D6T44L', { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```


## [await] getAllPixWait()
Getting all of output as numeric array.
Value is celcius degree within 5 to 50.
```javascript
// Javascript Example
var d6t = obniz.wired('D6T44L', { gnd: 0, vcc: 1, sda: 2, scl: 3 });
let temps = await d6t.getAllPixWait();
console.log('temperature:' + temps);
```

Drawing with canvas is easy.


```javascript
<canvas id="canvas" width="300" height="300"></canvas>

and

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
var width = canvas.width;
var height = canvas.height;

for(let x=0;x<4;x++) {
  for(let y=0;y<4;y++) {
    var temp = temps[x*4+y];
    var h = -80+(temp-29)*25
    ctx.fillStyle="hsl("+h+", 100%, 50%)";
    ctx.fillRect(width/4*x,height/4*y,width/4,height/4);
  }
}
```

## [await] getOnePixWait(pixel)
Getting only one pixel. Specify pixel as a number 0 to 15.

```javascript
// Javascript Example
var d6t = obniz.wired('D6T44L', { gnd: 0, vcc: 1, sda: 2, scl: 3 });
let temp = await d6t.getOnePixWait(10);
console.log('temperature:' + temp);
```
