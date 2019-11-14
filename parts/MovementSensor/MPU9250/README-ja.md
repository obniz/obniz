# MPU9250

加速度・ジャイロセンサーのMPU6050, 磁気センサーのAK8963を複合した9軸センサーモジュールです。

加速度3軸，ジャイロ3軸，地磁気(磁界)3軸の計9軸を検出します。

![](./image.jpg)

## wired("MPU9250", { [gnd , vcc , sda , scl , i2c, address]})
obniz Boardにセンサーを接続します。

obniz Boardからの3V出力はセンサーを動かすのに十分な電力ではないので、レギュレータなどで2.4-3.6Vを生成してください。

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```

## setConfig(accel_range, gyro_range, ADC_cycle)

MPU9250の設定をします。

- accel_range

 ±2, 4, 8, 16[g]のレンジから選べます。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

- gyro_range

±250, 500, 1000, 2000[deg/s]のレンジから選べます。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

- ADC_cycle

8, 100[Hz]から選べます。

8[Hz]	: データ量は少ないが，値がより安定する。
100[Hz]	: データをより多く測定出来る。

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
sensor.setConfig(2, 250, 8);
```

## [await] getAllWait

MPU9250の加速度センサー、ジャイロセンサー、磁気センサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAllWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
console.log('compass: %o', data.compass);
```
## [await] getAccelerometerWait()

加速度センサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAccelerometerWait();
console.log('accelerometer: %o', data);
```
## [await] getGyroscopeWait()

ジャイロのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getGyroscopeWait();
console.log('gyroscope: %o', data);
```

## [await] getCompassWait()

磁気センサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU9250", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getCompassWait();
console.log('compass: %o', data);
```

[データシート：共立プロダクツ](http://www.kyohritsu.jp/eclib/PROD/MANUAL/kp9250.pdf)

[データシート：ストロベリーリナックス](https://strawberry-linux.com/pub/mpu-9250-manual.pdf)