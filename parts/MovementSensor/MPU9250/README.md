#MPU9250

This is a 9-axis sensor module that combines the acceleration / gyro sensor 'MPU6050' and the magnetic sensor 'AK8963'.


A total of 9 axes consisted of 3 axes of acceleration, 3 axes of gyro, 3 axes of geomagnetic (magnetic field) are detected.

![](./image.jpg)

## wired("MPU9250", { gnd , vcc , sda , scl })

3.3V power supply is not supported by obniz Board, so need to get another way.


```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```
Set gnd, vcc, sda and scl to your favorite pins.


## setConfig(accel_range, gyro_range, ADC_cycle)

Initial settings of MPU9250.

- accel_range
You can select from the range of 2, 4, 8, 16 [g].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

- gyro_range
You can select from the range of 250, 500, 1000, 2000 [deg / s].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

- ADC_cycle
You can choose from 8, 100 [Hz].

8 [Hz]: Although the amount of data is small, the value becomes more stable.
100 [Hz]: More data can be measured.




## [await] getAllWait

Return acceleration, gyro, compass data.

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAllWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
console.log('compass: %o', data.compass);
```
## [await] getAccelerometerWait()

Return acceleration data.


```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAccelerometerWait();
console.log('accelerometer: %o', data);
```
## [await] getGyroscopeWait()

Return gyro data.

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getGyroscopeWait();
console.log('gyroscope: %o', data);
```

## [await] getCompassWait()


Return compass data.

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getCompassWait();
console.log('compass: %o', data);
```



[datasheet : play-zone](https://www.play-zone.ch/en/mpu-9250-accelerometer-gyro-kompass.html)

