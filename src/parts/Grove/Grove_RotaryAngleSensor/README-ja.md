# Grove_RotaryAngleSensor
Groveコネクタで利用できる可変抵抗です。ボリュームのように回すことで抵抗値を変えることが出来ます。  
抵抗値を読み取ることにより今どの位置に回されているのかがわかります。  
３本の端子があり、端の２つの間はどう回していても一定の抵抗値です。この２つの端子に電圧をかけます。  
回されることで間の１本の電圧が２つの電圧の間を移動します。

![](image.jpg)
このパーツで扱えるポテンションメーターの抵抗値は10Ω〜10kΩの間です。

## wired(obniz, {[signal, vcc, gnd, grove]});

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | no |  &nbsp; | signal 出力端子(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(0 pin of Grove)
grove | `object` | no | &nbsp;  | 接続するデバイスにgroveがある場合に利用できます

```Javascript
// Javascript Example
const meter = obniz.wired("Grove_RotaryAngleSensor", {gnd:0, vcc:1, signal: 3});
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```Javascript
// Javascript Example
const meter = obniz.wired("Grove_RotaryAngleSensor", {grove: obniz.grove0});
```

## onchange 
回転を監視し、回転された時にcallback関数を呼び出します。回転に合わせて0.0〜3.3(5.0)の値が返ります。
```Javascript
// Javascript Example
const meter = obniz.wired("Grove_RotaryAngleSensor", {grove: obniz.grove0});
meter.onchange = function(position) {
  console.log("position: " + position);
};
```