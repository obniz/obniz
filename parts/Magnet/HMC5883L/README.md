# Compass Sensor - HMC5883L

TRIPLE-AXIS magnetometer (compass) 

Calibration is important to get correct direction.

![](./image.jpg)

[Datasheet](http://www.farnell.com/datasheets/1683374.pdf)


## wired(obniz,  { [gnd, sda, scl, i2c]});

Connect to an obniz Board.

obniz Board can't supply a power to this sensor directly.
Use external 3.3v or use linear regulator to drop 5v output of obniz Board to 3.3v.

```javascript
// Javascript Example
var compass = obniz.wired("HMC5883L", {gnd:1 , sda:2 , scl:3 });
compass.init();
while(true) {
  var obj = await compass.get();
  console.log(obj.x, obj.y, obj.z);
}
```

## init();

initialize the sensor.

```javascript
// Javascript Example
var compass = obniz.wired("HMC5883L", {gnd:1 , sda:2 , scl:3 });
compass.init();
```

## [await] get()

get x,y,z result object from a sensor.

```javascript
// Javascript Example
var compass = obniz.wired("HMC5883L", {gnd:1 , sda:2 , scl:3 });
compass.init();
while(true) {
  var obj = await compass.get();
  console.log(obj.x, obj.y, obj.z);
}
```