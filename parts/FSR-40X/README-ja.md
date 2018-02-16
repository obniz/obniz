# Temperature Sensor - FSR40X
圧力センサFSR40Xです。センサで取得した圧力を知ることができます。

## wired(obniz, {pin0, pin1})
Obnizに圧力センサをつなぎます。
pin0,pin1を圧力センサへ接続してください。
```javascript
var pressure = obniz.wired("FSR40X", {pin0:0, pin1:1});
```

## onChange(callback(temp))
圧力センサの値に変化があった場合にcallback関数を呼び出します。
圧力は0~49の50段階で取得できます。

```javascript
var pressure = obniz.wired("FSR40X", {pin0:0, pin1:1});
pressure.onChange(function(press){
  console.log(press)
})
```
