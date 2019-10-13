#MPU6886

A total of 6 axes consisted of 3 axes of acceleration and 3 axes of gyro are detected.


## wired("MPU6886", { gnd , vcc , sda , scl })




```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```
Set gnd, vcc, sda and scl to your favorite pins.


## setConfig(accel_range, gyro_range)

Initial settings of MPU6886.

- accel_range
You can select from the range of 2, 4, 8, 16 [g].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

- gyro_range
You can select from the range of 250, 500, 1000, 2000 [deg / s].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.




## [await] getAllDataWait

Return acceleration, gyro, compass data.

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAllDataWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
```

## [await] getAccelWait()

Return acceleration data.


```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAccelWait();
console.log('accelerometer: %o', data);
```
## [await] getGyroWait()

Return gyro data.

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getGyroWait();
console.log('gyroscope: %o', data);
```

