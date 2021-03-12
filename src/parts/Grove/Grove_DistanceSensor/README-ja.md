# Grove_DistanceSensor
赤外線を利用した距離センサーです。
距離を電圧として出力するモジュールです。

![photo of wired](image.jpg)


## wired(obniz, {[vcc, gnd, signal, grove]})

obnizデバイスと接続します。  
黄線、赤線、黒線がそれぞれsignal、vcc、gndに対応します。  

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はvcc, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
gnd | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はgnd, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
signal | `number(obniz Board io)` | no |  &nbsp; | 	signal 出力端子
grove | `object` | no | &nbsp;  | 接続するデバイスにgroveがある場合に利用できます

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_DistanceSensor", {vcc:0, gnd:1, signal:2})
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```javascript
// Javascript Example
let sensor = obniz.wired("Grove_DistanceSensor", {grove: obniz.grove0});
```

## start(callback(distance))
距離を継続的に計測します。距離に変化があれば関数が呼ばれます。
単位は"mm"でunit()関数で他のものに変更できます。
```javascript
// Javascript Example
let sensor = obniz.wired("Grove_DistanceSensor", {grove: obniz.grove0});
sensor.start(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## [await] getWait()
一度だけ距離を測定します

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_DistanceSensor", {grove: obniz.grove0});

while (1) {
  var val = await sensor.getWait();
  console.log("distance " + val);
  await obniz.wait(1000);
}
    
```
    
## unit(unit)
単位を変更します。

1. "mm"(default)
2. "inch"

が利用できます。

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_DistanceSensor", {grove: obniz.grove0});
sensor.unit("inch")
sensor.start(function( distance ){
  console.log("distance " + distance + " inch")
})
```