# PT550

周りの明るさ(環境光)を取得するための照度センサーです。

以下の写真はそれを利用したDFROBOT社のモジュールです。

![](image.jpg)

## wired(obniz, { signal[, vcc, gnd]});

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | 出力となるアナログ端子です。(DFROBOT社のコネクタでは青色ケーブルです)
vcc | `number(obniz Board io)` | no |  &nbsp; | 電源として5vを出力する端子です。(DFROBOT社のコネクタでは赤色ケーブルです)
gnd | `number(obniz Board io)` | no |  &nbsp; | GNDにつないだピン番号です。(DFROBOT社のコネクタでは黒色ケーブルです)

PT550は3端子のフォトトランジスタで、vcc,gndに電圧をかけると、明るさに応じて流れる電流が変わります。
抵抗を利用することでその電流の変化を読み取ることができます。
DFROBOT社のモジュールは抵抗が含まれているのでマイコンなどにつないですぐに読み取ることができます。

```Javascript
// Javascript Example
var pt550 = obniz.wired("PT550", {gnd:0, vcc:1, signal:2});
pt550.onchange = function(voltage) {
  console.log(voltage);
}
```

## onchange = function(voltage)

明るの差の変化を値で受け取ります。
voltageはセンサーの出力電圧で0~電源電圧の間で変化します。
明るくなるほど電圧は上がります。

```Javascript
// Javascript Example
var pt550 = obniz.wired("PT550", {gnd:0, vcc:1, signal:2});
pt550.onchange = function(voltage) {
  console.log(voltage);
}
```

## [await] getWait()

onchangeで取得されるのと同じ値を一度のみ取得します。
値が変化に関係なく今の値を読み取ります。

```Javascript
// Javascript Example
var pt550 = obniz.wired("PT550", {gnd:0, vcc:1, signal:2});
const voltage = await pt550.getWait();
console.log(voltage);
```