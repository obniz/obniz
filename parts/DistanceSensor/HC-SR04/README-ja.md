# HC-SR04
超音波を利用した距離センサーです。

![](./image.jpg)

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
もし、反射してくる超音波を受け取れなかった場合はundefinedが返ります。
```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.measure(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## [await] measureWait()
measure()と同様ですが、こちらはpromiseを返す関数です。

```javascript
// Javascript Example
const hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
while(true) {
  let avg = 0;
  let count = 0;
  for (let i=0; i<3; i++) { // measure three time. and calculate average
    const val = await hcsr04.measureWait();
    if (val) {
      count++;
      avg += val;
    }
  }
  if (count > 1) {
    avg /= count;
  }
  console.log(avg);
  await obniz.wait(100);
}
```

## temp
超音波は温度により進む速度が違います。
デフォルトで15度で計算していますが、変更して正しい値にすることでより精度の高い結果が欲しい場合はtempから調整します。
```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.temp = 36;
var distance = await hcsr04.measureWait();
console.log("distance " + distance + " mm")
```

## reset_alltime
一部のHC-SR04では、計測するときに毎回電源のON-OFFが必要なものがあります。
もし、計測がうまくいかない場合はこのプロパティをtrueにすることで
自動的にリセットを行います。
```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.reset_alltime = true;
var distance = await hcsr04.measureWait();
console.log("distance " + distance + " mm")
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