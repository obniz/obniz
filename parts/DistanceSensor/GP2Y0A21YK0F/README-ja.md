# GP2Y0A21YK0F
赤外線を利用した距離センサーです。
距離を電圧として出力するモジュールです。

![photo of wired](./image.jpg)

![photo of wired](./image.gif)

## wired(obniz, {vcc, gnd, signal})

![photo of wired](./wired.png)
```javascript
// Javascript Example
var sensor = obniz.wired("GP2Y0A21YK0F", {vcc:0, gnd:1, signal:2})
sensor.start(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## start(callback(distance))
距離を継続的に計測します。距離に変化があれば関数が呼ばれます。
単位は"mm"でunit()関数で他のものに変更できます。
```javascript
// Javascript Example
var sensor = obniz.wired("GP2Y0A21YK0F", {vcc:0, gnd:1, signal:2})
sensor.start(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## [await] getWait()
一度だけ距離を測定します

```javascript
// Javascript Example
var sensor = obniz.wired("GP2Y0A21YK0F", {vcc:0, gnd:1, signal:2})

while (1) {
  var val = await sensor.getWait();
  console.log("distance " + val);
  await obniz.wait(1000);
}
    
```
    
    
    
## unit(unit)
単位を変更します。

1. "mm"(default)
2. "inch"

が利用できます。

```javascript
// Javascript Example
var sensor = obniz.wired("GP2Y0A21YK0F", {vcc:0, gnd:1, signal:2})
sensor.unit("inch")
sensor.start(function( distance ){
  console.log("distance " + distance + " inch")
})
```