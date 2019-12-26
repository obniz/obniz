#SH200Q

A total of 6 axes consisted of 3 axes of acceleration and 3 axes of gyro are detected.


## wired("SH200Q", { gnd , vcc , sda , scl })




```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```
Set gnd, vcc, sda and scl to your favorite pins.



## [await] getAllDataWait

Return acceleration, gyro, compass data.

```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAllDataWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
```

## [await] getAccelWait()

Return acceleration data.


```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAccelWait();
console.log('accelerometer: %o', data);
```
## [await] getGyroWait()

Return gyro data.

```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getGyroWait();
console.log('gyroscope: %o', data);
```

