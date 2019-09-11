# Grove_3AxisAccelerometer

Library for Grove 3-axis accelerometer module[Grove - 3 Axis Digital Accelerometer(±16g)](http://wiki.seeedstudio.com/Grove-3-Axis_Digital_Accelerometer-16g/)

![](./image.jpg)

## wired(scl, sda {, vcc, gnd})
Connect pins to an obniz Board.

| grove | cable | obniz |
|:--:|:--:|:--:|
| scl | - | scl |
| sda | - | sda |
| vcc | - | vcc |
| gnd | - | gnd |

```javascript
// Javascript Example
var accelMeter = obniz.wired("Grove_3AxisAccelerometer", { scl:0, sda:1, vcc:2, gnd:3 });
```

## [await] getWait()
Get values from sensor.
It return values in array which has three elements.
Values are unit of gravity, "g".

```javascript
// Javascript Example
var accelMeter = obniz.wired("Grove_3AxisAccelerometer", { scl:0, sda:1, vcc:2, gnd:3 });
var val = await accelMeter.getWait(); // [x,y,z]
console.log(val);
```
