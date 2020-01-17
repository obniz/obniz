# IPM-165

24Ghzの周波数を利用した移動体験知用のドップラーモジュールです。
人や物など移動するものの検知に利用できます。

以下の写真はそれを利用したイノセント社のモジュールです。

[データシート](https://manualzz.com/doc/15328561/ist2011-001-r2)

![](image.jpg)

## wired(obniz, { signal[, vcc, gnd]});

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | 出力となるアナログ端子です。
vcc | `number(obniz Board io)` | no |  &nbsp; | 電源として5vを出力する端子です。
gnd | `number(obniz Board io)` | no |  &nbsp; | GNDにつないだピン番号です。

写真にあるイノセント社のモジュールでは印刷面を正面にし、ピンを下側にしたときに左側から VCC, SIGNAL, GNDとなります。

```Javascript
// Javascript Example
var IPM165 = obniz.wired("IPM-165", {vcc:0, signal:1, gnd:2});
IPM165.onchange = function(voltage) {
  console.log(voltage);
}
```

## onchange = function(voltage)

現在の値を受け取ります。
移動体を検知するとこの値が変化します。

```Javascript
// Javascript Example
var IPM165 = obniz.wired("IPM-165", {vcc:0, signal:1, gnd:2});
IPM165.onchange = function(voltage) {
  console.log(voltage);
}
```

## [await] getWait()

onchangeで取得されるのと同じ値を一度のみ取得します。
値が変化に関係なく今の値を読み取ります。

```Javascript
// Javascript Example
var IPM165 = obniz.wired("IPM-165", {vcc:0, signal:1, gnd:2});
const voltage = await IPM165.getWait();
console.log(voltage);
```