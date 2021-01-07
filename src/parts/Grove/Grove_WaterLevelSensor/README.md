# Grove_3AxisAccelerometer

Library for Grove water level sensor module [Grove Water Level Sensor](https://wiki.seeedstudio.com/Grove-Water-Level-Sensor/).

![](image.jpg)

## wired(scl, sda {, vcc, gnd, grove})

Connect pins to an obniz Board.

| grove | cable | obniz |
|:--:|:--:|:--:|
| scl | - | scl |
| sda | - | sda |
| vcc | - | vcc |
| gnd | - | gnd |

```javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
```

If the device has a grove interface, it can be connected with just the parameter {grove: obniz.grove0}.
```javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { grove: obniz.grove0 });
```

## onchange = function(value)

Change callback of water level change.  
Its value changes water level in millimeters.
  
  
```Javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
sensor.onchange = function(value) {
  console.log(value);  // 0 mm - 100 mm
}
```

## [await] getWait()

Get values from sensor.
It returns the water level in millimeters.

```javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
var val = await waterLevelSensor.getWait(); // 0 mm - 100 mm
console.log(val);
```
