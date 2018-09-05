# Compass Sensor - HMC5883L
3軸地磁気センサです。取得した値から方位を知ることができます。
コンパスとして使うには、キャリブレーションが必要です。

## wired(obniz,  { vcc, gnd, sda, scl});
Obnizに地磁気センサをつなぎます。

```javascript
// Javascript Example
var compass = obniz.wired("HMC5883L", {vcc:0 , gnd:1 , sda:2 , scl:3 });
```

## init();
センサを初期化します。
```javascript
// Javascript Example
var compass = obniz.wired("HMC5883L", {vcc:0 , gnd:1 , sda:2 , scl:3 });
compass.init();
```

## [await] get(axis)
axisで指定した軸の値を返します。
axisにはx,y,zのいずれかを指定します。

以下はX軸の値を取得するサンプルです。
```javascript
// Javascript Example
var compass = obniz.wired("HMC5883L", {vcc:0 , gnd:1 , sda:2 , scl:3 });
compass.init();
var X = await compass.get("x");
console.log('x = ' + X);
```
