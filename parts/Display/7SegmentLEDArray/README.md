# 7SegmentLEDArray
7 Segment LED Array. Cathode/Anode Common.
Dynamic Lightning.
This uses "7SegmentLED" parts.

![](./image.jpg)

## wired(obniz, {segments:[]})
provide 7SegmentLED. min 1.
This 7SegmentLEDArray will drive all 7 segments automatically by Dynamic Lightning.

```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:6, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});
segArray.print(1234);

```


![](./wired.png)

## print(number)

```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:6, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});
segArray.print(1234);
```

## off()
turn display off
```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:6, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});

segArray.print(1234);
await obniz.wait(1000);
segArray.off();
await obniz.wait(1000);
segArray.on();
```

## on()
turn display off
```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:6, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED",  {a:7, b: 8, c: 1, d:2, e:3, f:5, g:4, dp:0, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", {segments: [seg0, seg1, seg2, seg3]});

segArray.print(1234);
await obniz.wait(1000);
segArray.off();
await obniz.wait(1000);
segArray.on();
```
