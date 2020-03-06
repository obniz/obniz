# M5StickC_ToF

レーザー測距センサVL53L0Xを内蔵するM5StickC用距離センサです。
30mm~2000mmを計測できます。

![](./image.jpg)

## wired(obniz, {[scl, sda, vcc, gnd, i2c]})
obnizデバイスと接続します。  
もしM5StickCを使用している場合、ピン指定を省略することができます。


```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF");
var distance = await sensor.getWait();
console.log(distance);
```


他のデバイスの場合は、下記のようにピン指定を行ってください。 

name | type | required | default | description
--- | --- | --- | --- | ---
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclとなる端子です
sda | `number(obniz Board io)` | no | &nbsp;  | I2Cのsdaとなる端子です
i2c | `object` | no | &nbsp;  | obnizのi2cオブジェクトです

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```


## [await] getWait()
距離(mm)を一度だけ取得します。

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```