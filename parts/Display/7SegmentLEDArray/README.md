# 7SegmentLEDArray
7 Segment LED Array. Cathode/Anode Common.
Dynamic Lightning.
This uses "7SegmentLED" parts.

## wired(obniz, 7segment0, 7segment1, 7segment2, 7segment3e)
provide 7SegmentLED up to 4.
This 7SegmentLEDArray will drive all 7 segments automatically.
Dynamic Lightning.

```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", seg0, seg1, seg2, seg3);
segArray.print(1234);

```
## print(number)

```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", seg0, seg1, seg2, seg3);
segArray.print(1234);
```

## off()
turn display off
```javascript
// Javascript Example
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", seg0, seg1, seg2, seg3);

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
var seg0 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:8, commonType:"cathode"});
var seg1 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:9, commonType:"cathode"});
var seg2 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:10, commonType:"cathode"});
var seg3 = obniz.wired("7SegmentLED", {a:2, b: 0, c: 3, d:5, e:6, f:4, g:1, dp:null, common:11, commonType:"cathode"});

var segArray = obniz.wired("7SegmentLEDArray", seg0, seg1, seg2, seg3);

segArray.print(1234);
await obniz.wait(1000);
segArray.off();
await obniz.wait(1000);
segArray.on();
```
