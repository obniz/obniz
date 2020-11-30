# Grove_Buzzer

Groveコネクタで利用できるブザーです。指定した高さの音を鳴らすことができます。

![](image.jpg)

## wired(obniz,  { signal [, vcc, gnd, grove]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal 出力端子(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(0 pin of Grove)
grove | `object` | no | &nbsp;  | 接続するデバイスにgroveがある場合に利用できます

  

```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {gnd:0, vcc:1, signal: 3});
```
  
groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {grove: obniz.grove0});
```
## play(frequency)

スピーカーから指定した周波数の音を鳴らします

```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {gnd:0, vcc:1, signal: 3});
speaker.play(1000) // 1000 Hz
```

## stop()

再生を停止します。

```Javascript
// Javascript Example
var speaker = obniz.wired("Grove_Buzzer", {gnd:0, vcc:1, signal: 3});
speaker.play(1000) // 1000 Hz
await obniz.wait(1000);
speaker.stop();
```