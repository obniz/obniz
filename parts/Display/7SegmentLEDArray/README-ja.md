# 7SegmentLEDArray
7セグメントアレイです。7SegmentLEDを複数連ねてダイナミック点灯させることができます。
カソードコモン/アノードコモンに対応しています。

## wired(obniz, {segments:[]})
wiredで作った7セグメントのオブジェクトをsegmentsとして渡してください。最低１つは必要です。
それにより自動的にダイナミック点灯して、複数桁の数字などを表示できます。

```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});
segArray.print(1234);

```
## print(number)

数字を表示します。小数以下は切り取られます。

```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});
segArray.print(1234);
```

## off()
ディスプレイを消灯します。
```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});

segArray.print(1234);
await obniz.wait(1000);
segArray.off();
await obniz.wait(1000);
segArray.on();
```

## on()
ディスプレイを点灯します。最後に表示していた数値が表示されます。
```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});

segArray.print(1234);
await obniz.wait(1000);
segArray.off();
await obniz.wait(1000);
segArray.on();
```
