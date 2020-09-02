# Grove_LightSensor

Groveコネクタで利用できる照度センサーです。周りの明るさを取得することができます。

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
let sensor = obniz.wired("Grove_LightSensor", {gnd:0, vcc:1, signal: 3});
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {grove: obniz.grove0});
```

このセンサーは3端子のフォトレジスタで、vcc,gndに電圧をかけると明るさに応じて電圧を生成します。
抵抗を利用することでその電圧の変化を読み取ることができます。

## onchange = function(value)

明るさの変化を値で受け取ります。
valueはセンサーの出力電圧で0~電源電圧の間で変化します。
明るいほど電圧は上がります。  
  
  
```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {grove: obniz.grove0});
sensor.onchange = function(value) {
  console.log(value);
}
```

## [await] getWait()

明るさを一度のみ取得します。
値が変化に関係なく今の値を読み取ります。

```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {grove: obniz.grove0});
const value = await sensor.getWait();
console.log(value);
```