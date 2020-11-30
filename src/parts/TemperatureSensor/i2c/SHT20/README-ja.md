# Temperature Sensor - SHT20
温度センサSHT20です。センサで取得した温度を知ることができます。

![](image.jpg)

## wired(obniz,  {vcc , sda, scl, gnd,} )
obniz Boardに温度センサをつなぎます。
```javascript
// Javascript Example
var sensor = obniz.wired("SHT20", {vcc : 0, sda:1, scl:2, gnd:4});
```
## [await] getTempWait()
現在の温度を計測して返します。単位は摂氏(°C)です。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT20", {vcc : 0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var temp = await sensor.getTempWait();
console.log('temperature:' + temp);
```

## [await] getHumidWait()
現在の湿度を計測して返します。単位は%です。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT20", {vcc : 0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var humd = await sensor.getHumidWait();
console.log('humidity:' + humd);
```
