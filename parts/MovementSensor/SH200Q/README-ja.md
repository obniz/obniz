# SH200Q

加速度3軸，ジャイロ3軸の計6軸を検出します。


## wired("SH200Q", { [gnd , vcc , sda , scl , i2c]})
obniz Boardにセンサーを接続します。

```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
```



## [await] getAllDataWait

SH200Qの加速度センサー、ジャイロセンサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAllDataWait();
console.log('accelerometer: %o', data.accelerometer);
console.log('gyroscope: %o', data.gyroscope);
```

## [await] getAccelWait()

加速度センサーのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getAccelWait();
console.log('accelerometer: %o', data);
```
## [await] getGyroWait()

ジャイロのデータを取得して、JSONで返します。

```javascript
var sensor = obniz.wired("SH200Q", { gnd: 0, vcc: 1, sda: 2, scl: 3 });
const data = await sensor.getGyroWait();
console.log('gyroscope: %o', data);
```