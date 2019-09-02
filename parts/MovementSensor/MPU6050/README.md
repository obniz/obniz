# MPU6050

This is a sensor module that combines the acceleration / gyro. 
3 axes of acceleration, 3 axes of gyro are detected.

![](./image.jpg)

## wired("MPU6050", { [gnd , vcc , sda , scl , i2c, address]})
Set gnd, vcc, sda and scl to your favorite pins.
3.3V power supply is not supported by obniz Board, so need to get another way.


```javascript
var sensor = obniz.wired("MPU6050", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```

## setConfig(accel_range, gyro_range)

Initial settings of MPU6050.

- accel_range

You can select from the range of 2, 4, 8, 16 [g].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

- gyro_range

You can select from the range of 250, 500, 1000, 2000 [deg / s].

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

```javascript
var sensor = obniz.wired("MPU6050", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
sensor.setConfig(2, 250);
```

## [await] getWait

Return acceleration, gyro data.

```javascript
var sensor = obniz.wired("MPU6050", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
```