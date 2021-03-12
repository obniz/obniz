# Grove_SoilMoistureSensor

Groveコネクタで利用できる土壌湿度センサです。土壌の湿度を取得できます。  
返される値は0~3.3(5.0)の範囲で、湿度が高いほど値は低く(0に近く)なります。

![](image.jpg)

## wired(obniz, {[signal, vcc, gnd, grove]});

obnizデバイスと接続します。  
黄線、赤線、黒線がそれぞれsignal、vcc、gndに対応します。

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はvcc, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
gnd | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はgnd, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
signal | `number(obniz Board io)` | no |  &nbsp; | signal 出力端子
grove | `object` | no | &nbsp;  | 接続するデバイスにgroveがある場合に利用できます

```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {gnd:0, vcc:1, signal: 3});
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {grove: obniz.grove0});
```

## onchange(value)
土壌湿度センサの値に変化があった場合にcallback関数を呼び出します。

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {grove: obniz.grove0});
sensor.onchange = function(value){
  console.log(value)
};
```
## [await] getWait()
土壌湿度センサの値を一度だけ計測して返します。

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {grove: obniz.grove0});
let value = await sensor.getWait();
console.log('Humidity Level:' + value);
```
