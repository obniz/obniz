# Grove_EarHeartRate
Grove の耳たぶクリップ式心拍センサーです

![](./image.jpg)

Stores

[http://wiki.seeedstudio.com/Grove-Ear-clip_Heart_Rate_Sensor/](http://wiki.seeedstudio.com/Grove-Ear-clip_Heart_Rate_Sensor/)

[https://www.switch-science.com/catalog/2526/](https://www.switch-science.com/catalog/2526/)


## wired(obniz, {gnd, vcc, signal})
センサーと接続します。
センサーからはGroveケーブルで３本のケーブルがでています。
黒がGND,赤がVCC、黄色がsignalです。

![](./heartrate.jpg)

```javascript
// Javascript Example
var heartrate = obniz.wired("Grove_EarHeartRate", {gnd: 0, vcc: 1, signal: 2});
heartrate.start(function(rate){
  console.log(rate);
})
```

## start(callback(heartrate))
心拍数を計測し、計測値をcallback関数に渡します。
およそ３秒ごと（ネットワークに依存）に計測します。計測できなかった場合はcallback関数は呼ばれません。
```javascript
// Javascript Example
var heartrate = obniz.wired("Grove_EarHeartRate", {gnd: 0, vcc: 1, signal: 2});
heartrate.start(function(rate){
  console.log(rate);
})
```


## [await] getWait()
1回だけ心拍数を計測します

```javascript
// Javascript Example
var heartrate = obniz.wired("Grove_EarHeartRate", {gnd: 0, vcc: 1, signal: 2});
var rate = await heartrate.getWait();
console.log(rate);
```