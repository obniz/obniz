# Thermal Camera Sensor - AMG8833
Adafruitのサーマルカメラモジュールです。赤外線アレイセンサAMG8833を使用しています。
測定範囲は0~80℃です。
8x8画素で温度分布を測定することができます。

## wired(obniz,  {[vin, gnd, sda, scl, address]} )
obnizにセンサをつなぎます。
AMG8833は3.3V駆動です。vinは5V出力になりますので、Adafruit社製以外のモジュールを使用する場合は注意してください。
addressは未指定の場合は0x69になります。モジュール裏面のジャンパを接続した場合は、0x68を指定してください。
```javascript
// Javascript Example
var grideye = obniz.wired("AMG8833", {vcc:0, gnd:1, sda:2, scl:3, address:0x69});
```
## [await] getOnePix(pixel)
pixelで指定した1画素の温度を出力します。画素は0~63の範囲で指定してください。
```javascript
// Javascript Example
var grideye = obniz.wired("AMG8833", {vcc:0, gnd:1, sda:2, scl:3});
var temp = await grideye.getOnePix(10);
console.log('temperature:' + temp);
```

## [await] getAllPix()
64個すべての画素の温度を取得します。
戻り値は64個の要素を持つ配列です。
```javascript
// Javascript Example
var grideye = obniz.wired("AMG8833", {vcc:0, gnd:1, sda:2, scl:3});
var temp = await grideye.getAllPix();
console.log('temperature:' + temp);
```
