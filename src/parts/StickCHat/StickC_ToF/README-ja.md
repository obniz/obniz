# StickC_ToF

レーザー測距センサVL53L0Xを内蔵するM5StickC用距離センサです。
30mm~2000mmを計測できます。

![](./image.jpg)

## wired(obniz, {[scl, sda, vcc, gnd, i2c]})
obnizデバイスと接続します。  
M5StickCと接続する場合は、G0をsdaに、G26をsclに指定してください。
その他の場合には，更にvccとgndを適切なピンに指定してください．  

name | type | required | default | description
--- | --- | --- | --- | ---
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclとなる端子です
sda | `number(obniz Board io)` | no | &nbsp;  | I2Cのsdaとなる端子です
i2c | `object` | no | &nbsp;  | obnizのi2cオブジェクトです

```javascript
// JavaScript Examples
var sensor = obniz.wired("StickC_ToF", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```

## [await] getWait()
距離(mm)を一度だけ取得します。

```javascript
// JavaScript Examples
var sensor = obniz.wired("StickC_ToF", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```