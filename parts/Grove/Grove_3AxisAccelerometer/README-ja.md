# Grove_3AxisAccelerometer

Grove 3軸加速度センサモジュール[Grove - 3 Axis Digital Accelerometer(±16g)](http://wiki.seeedstudio.com/Grove-3-Axis_Digital_Accelerometer-16g/)からX,Y,Z軸の加速度を取得するライブラリです。

## wired(scl, sda {, vcc, gnd})
obnizにセンサーを接続します。
Groveシステムなので、
| obniz | Groveケーブルの色 |
|:--:|:--:|
| scl | 黄 |
| sda | 白 |
| vcc | 赤 |
| gnd | 黒 |
となるはずです。

```javascript
// Javascript Example
var accelMeter = obniz.wired("Grove_3AxisAccelerometer", { scl:0, sda:1, vcc:2, gnd:3 });
```

## [await] getVal()
センサーから値を取得します。
戻り値はX,Y,Z軸の値が順に入った配列で返されます。
値は重力の単位,gです。

```javascript
// Javascript Example
var accelMeter = obniz.wired("Grove_3AxisAccelerometer", { scl:0, sda:1, vcc:2, gnd:3 });
var val = await accelMeter.getVal(); // [x,y,z]
console.log(val);
```
