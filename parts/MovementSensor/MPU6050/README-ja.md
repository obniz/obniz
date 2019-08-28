# MPU6050

加速度・ジャイロセンサーの6軸センサーモジュールです。

加速度3軸，ジャイロ3軸の計6軸を検出します。

![](./image.jpg)

## wired("MPU6050", { [gnd , vcc , sda , scl , i2c, address]})
obniz Boardにセンサーを接続します。

obniz Boardからの3V出力はセンサーを動かすのに十分な電力ではないので、レギュレータなどで2.4-3.6Vを生成してください。

```javascript
var sensor = obniz.wired("MPU6050", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```

## setConfig(accel_range, gyro_range)

MPU6050の設定をします。

- accel_range

 ±2, 4, 8, 16[g]のレンジから選べます。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

- gyro_range

±250, 500, 1000, 2000[deg/s]のレンジから選べます。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

```javascript
var sensor = obniz.wired("MPU6050", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
sensor.setConfig(2, 250);
```

## [await] getWait

MPU9250の加速度センサー、ジャイロセンサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("MPU6050", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
```