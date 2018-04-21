# HC-SR04
超音波を利用した距離センサーです。

## wired(obniz, {vcc, trigger, echo, gnd})

![photo of wired](./wired.png)
```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.measure(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## measure(callback(distance))
距離を計測します、計測が完了したらcallback関数が呼ばれます。
距離の単位はmmで、unit()関数でinchに変えることも出来ます。
もし、反射してくる超音波を受け取れなかった場合はnullが返ります。
```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.measure(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## unit(unit)
単位を変更します。

1. "mm"(default)
2. "inch"

が利用可能です。

```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.unit("inch")
hcsr04.measure(function( distance ){
  console.log("distance " + distance + " inch")
})
```