# 7SegmentLED
7 Segment LED. Cathode/Anode Common.

![](./image.jpg)

## wired(obniz,{ a, b, c, d, e, f, g, dp, common, commonType})
a to g is 7 segment's io.
dp is deciminal point.
commonType must be "anode"/"cathode". default is "cathode".

```javascript
// Javascript Example
var seg = obniz.wired("7SegmentLED", {a:5, b: 6, c: 7, d:1, e:0, f:3, g:2, dp:8, common:4, commonType:"cathode"});
seg.print(7);
```


![](./wired.png)

## print(number)
print a number.

.print(7) => 7

.print(89) => 9

```javascript
// Javascript Example
var seg = obniz.wired("7SegmentLED", {a:5, b: 6, c: 7, d:1, e:0, f:3, g:2, dp:8, common:4, commonType:"cathode"});

for(var i=0; i<10; i++){
  seg.print(i)
  await obniz.wait(1000);
}
```

## printRaw(number)
control each led directly.
```javascript
// Javascript Example
var seg = obniz.wired("7SegmentLED", {a:5, b: 6, c: 7, d:1, e:0, f:3, g:2, dp:8, common:4, commonType:"cathode"});
seg.printRaw(0x77)
```

## off()
turn display off
```javascript
// Javascript Example
var seg = obniz.wired("7SegmentLED", {a:5, b: 6, c: 7, d:1, e:0, f:3, g:2, dp:8, common:4, commonType:"cathode"});

for(var i=0; i<10; i++){
  seg.print(i)
  await obniz.wait(1000);
}
seg.off();
```

## on()
turn display on
```javascript
// Javascript Example
var seg = obniz.wired("7SegmentLED", {a:5, b: 6, c: 7, d:1, e:0, f:3, g:2, dp:8, common:4, commonType:"cathode"});

seg.print(7);
while(true){
  seg.on();
  await obniz.wait(1000);
  seg.off();
  await obniz.wait(1000);
}
```

## dpState(show)
turn on/off dp
```javascript
// Javascript Example
var seg = obniz.wired("7SegmentLED", {a:5, b: 6, c: 7, d:1, e:0, f:3, g:2, dp:8, common:4, commonType:"cathode"});

seg.print(7);
while(true){
  seg.dpState(true);
  await obniz.wait(1000);
  seg.dpState(false);
  await obniz.wait(1000);
}
```
