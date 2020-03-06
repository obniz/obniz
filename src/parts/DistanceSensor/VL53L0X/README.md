# VL53L0X

laser distance sensor VL53L0X.  
It measure 30mm~2000mm.


## wired(obniz, {[scl, sda, i2c]})
connect to the obniz Board.

Prepare power source for this sensor.

name | type | required | default | description
--- | --- | --- | --- | ---
scl | `number(obniz Board io)` | no |  &nbsp; | scl of I2C
sda | `number(obniz Board io)` | no | &nbsp;  | sda of I2C
i2c | `object` | no | &nbsp;  | obniz i2c object

```javascript
// JavaScript Examples
var sensor = obniz.wired("VL53L0X", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```

## [await] getWait()
get the distance(mm) once.   

```javascript
// JavaScript Examples
var sensor = obniz.wired("VL53L0X", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```