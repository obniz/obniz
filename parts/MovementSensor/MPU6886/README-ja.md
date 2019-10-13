# MPU6886

加速度3軸，ジャイロ3軸の計6軸を検出します。


## wired("MPU6886", { [gnd , vcc , sda , scl , i2c]})
obniz Boardにセンサーを接続します。

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```

## setConfig(accel_range, gyro_range)

MPU9250の設定をします。

- accel_range

 ±2, 4, 8, 16[g]のレンジから選べます。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

- gyro_range

±250, 500, 1000, 2000[deg/s]のレンジから選べます。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
sensor.setConfig(2, 250);
```

## [await] getAllDataWait

MPU6886の加速度センサー、ジャイロセンサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAllDataWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
```

## [await] getAccelWait()

加速度センサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAccelWait();
console.log('accelerometer: %o', data);
```
## [await] getGyroWait()

ジャイロのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU6886", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getGyroWait();
console.log('gyroscope: %o', data);
```