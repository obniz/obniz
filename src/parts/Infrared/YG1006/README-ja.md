# YG1006

炎を検知するための赤外線センサーモジュールです。

以下の写真はそれを利用したDFROBOT社のモジュールです。

![](image.jpg)

## wired(obniz, { signal[, vcc, gnd]});

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | 出力となるアナログ端子です。(DFROBOT社のコネクタでは青色ケーブルです)
vcc | `number(obniz Board io)` | no |  &nbsp; | 電源として5vを出力する端子です。(DFROBOT社のコネクタでは赤色ケーブルです)
gnd | `number(obniz Board io)` | no |  &nbsp; | GNDにつないだピン番号です。(DFROBOT社のコネクタでは黒色ケーブルです)

YG1006は赤外線センサーで、流れる電流が炎の出す赤外線に応じて流れる電流が変わります。
抵抗を利用することでその電流の変化を読み取ることができます。
DFROBOT社のモジュールは抵抗が含まれているのでマイコンなどにつないですぐに読み取ることができます。

```Javascript
// Javascript Example
var YG1006 = obniz.wired("YG1006", {gnd:0, vcc:1, signal:2});
YG1006.onchange = function(voltage) {
  console.log(voltage);
}
```

## onchange = function(voltage)

赤外線の変化を値で受け取ります。
voltageはセンサーの出力電圧で0~電源電圧の間で変化します。
強くなるほど電圧は上がります。

vccに5vをかけた状態で、炎がない状態で0.02程度。ライターの火を近づけて0.3程度の値となります。

```Javascript
// Javascript Example
var YG1006 = obniz.wired("YG1006", {gnd:0, vcc:1, signal:2});
YG1006.onchange = function(voltage) {
  console.log(voltage);
}
```

## [await] getWait()

onchangeで取得されるのと同じ値を一度のみ取得します。
値が変化に関係なく今の値を読み取ります。

```Javascript
// Javascript Example
var YG1006 = obniz.wired("YG1006", {gnd:0, vcc:1, signal:2});
const voltage = await YG1006.getWait();
console.log(voltage);
```