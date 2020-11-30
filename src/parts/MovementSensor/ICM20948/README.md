# ICM20948

This is a 9-axis sensor module that combines the acceleration / gyro sensor and the magnetic sensor 'AK09916'.

A total of 9 axes consisted of 3 axes of acceleration, 3 axes of gyro, 3 axes of geomagnetic (magnetic field) are detected.


## wired("ICM20948", { [gnd , vcc , sda , scl , i2c, address]})

3.3V power supply is not supported by obniz Board, so need to get another way.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
```

Set gnd, vcc, sda and scl to your favorite pins.


## [await] initWait()

Initial settings of ICM20948.


## accelFs(accel_range)
You can select from the range of 2, 4, 8, 16 [g].
Initial value is 2g.

Range large: A wide range can be measured.
Range small: The value can be measured in detail.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.accelFs("2g");
```

## accelSf(accel_unit)
The unit of acceleration can be selected from g, mg, ms2. The default value is ms2.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.accelFs("ms2");
```

## gyroFs(gyro_range)
You can select from the range of 250, 500, 1000, 2000 [deg / s].
Initial value is 250dps.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.gyroFs("250dps");
```

## gyroSf(gyro_unit)
The unit of gyroscope can be selected from dps, rps. The default value is dps.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.gyroSf("dps");
```

## [await] accelerationWait()

Return acceleration data.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
const data=await sensor.accelerationWait();
console.log(data[0]);
```

## [await] gyroWait()

Return gyro data.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
const data=await sensor.gyroWait();
console.log(data[0]);
```

## [await] magneticWait()

Return magnetic data.

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
const data=await sensor.magneticWait();
console.log(data[0]);
```

[datasheet: InvenSense](https://www.invensense.com/wp-content/uploads/2016/06/DS-000189-ICM-20948-v1.3.pdf)
