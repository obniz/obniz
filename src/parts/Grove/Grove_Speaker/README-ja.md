# Grove_Speaker

Groveコネクタで利用できるスピーカーです。  
指定した周波数の音を鳴らします。

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
const speaker = obniz.wired("Grove_Speaker", {gnd:0, vcc:1, signal: 3});
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```Javascript
// Javascript Example
const speaker = obniz.wired("Grove_Speaker", {grove: obniz.grove0})
```

## play(frequency)
スピーカーから指定した周波数の音を鳴らします。

```Javascript
// Javascript Example
const speaker = obniz.wired("Grove_Speaker", {grove: obniz.grove0})
speaker.play(1000); //1000hz
```

## stop()
再生を停止します。

```Javascript
// Javascript Example
const speaker = obniz.wired("Grove_Speaker", {grove: obniz.grove0})
speaker.play(1000); //1000hz
await obniz.wait(1000);
speaker.stop();
```

