# Pressure Sensor - FSR40X
圧力センサFSR40Xです。センサで取得した圧力を知ることができます。

![](./image.jpg)

## wired(obniz, {pin0, pin1})
obniz Boardに圧力センサをつなぎます。
pin0,pin1を圧力センサへ接続してください。

![](./wired.png)
```javascript
// Javascript Example
var pressure = obniz.wired("FSR40X", {pin0:0, pin1:1});
```

## onchange = function(temp){}
圧力センサの値に変化があった場合にcallback関数を呼び出します。

```javascript
// Javascript Example
var pressure = obniz.wired("FSR40X", {pin0:0, pin1:1});
pressure.onchange =function(press){
  console.log(press)
}
```

## [await]getWait();
圧力センサの値を一度だけ取得します

```javascript
// Javascript Example
var pressure = obniz.wired("FSR40X", {pin0:0, pin1:1});
var press = await pressure.getWait();
console.log(press)
```
