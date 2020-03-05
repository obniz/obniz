# ICM20948

加速度・ジャイロセンサーと、磁気センサーとしてAK09916を複合した9軸センサーモジュールです。

加速度3軸，ジャイロ3軸，地磁気(磁界)3軸の計9軸を検出します。


## wired("ICM20948", { [gnd , vcc , sda , scl , i2c, address]})
obniz Boardにセンサーを接続します。

obniz Boardからの3V出力はセンサーを動かすのに十分な電力ではないので、レギュレータなどで1.71-3.6Vを生成してください。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
```

## [await] initWait()

ICM20948を初期化します。


## accelFs(accel_range)
 ±2, 4, 8, 16[g]のレンジから選べます。初期値は2gです。

レンジ大	: 広いレンジが測れる。
レンジ小	: 値が細かく測れる。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.accelFs("2g");
```

## accelSf(accel_unit)
 加速度の単位を g, mg, ms2 から選べます。初期値は ms2 です。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.accelFs("ms2");
```

## gyroFs(gyro_range)
±250, 500, 1000, 2000[deg/s]のレンジから選べます。
初期値は250dpsです。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.gyroFs("250dps");
```

## gyroSf(gyro_unit)
 ジャイロの単位を dps, rps から選べます。初期値は dps です。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
sensor.gyroSf("dps");
```

## [await] accelerationWait()

加速度センサーのデータを取得して、配列で返します。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
const data=await sensor.accelerationWait();
console.log(data[0]);
```

## [await] gyroWait()

ジャイロセンサーのデータを取得して、配列で返します。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
const data=await sensor.gyroWait();
console.log(data[0]);
```

## [await] magneticWait()

磁気センサーのデータを取得して、配列で返します。

```javascript
var sensor = obniz.wired("ICM20948", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
await sensor.initWait();
const data=await sensor.magneticWait();
console.log(data[0]);
```

[データシート：InvenSense](https://www.invensense.com/wp-content/uploads/2016/06/DS-000189-ICM-20948-v1.3.pdf)
