# VL53L0X

レーザーで測定する距離センサーです。
30mm~2000mmを計測できます。

## wired(obniz, {[scl, sda, i2c]})
obnizデバイスと接続します。  

このセンサーは外部から電源を供給する必要があります。

name | type | required | default | description
--- | --- | --- | --- | ---
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclとなる端子です
sda | `number(obniz Board io)` | no | &nbsp;  | I2Cのsdaとなる端子です
i2c | `object` | no | &nbsp;  | obnizのi2cオブジェクトです

```javascript
// JavaScript Examples
var sensor = obniz.wired("VL53L0X", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```

## [await] getWait()
距離(mm)を一度だけ取得します。

```javascript
// JavaScript Examples
var sensor = obniz.wired("VL53L0X", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```