# Temperature Sensor - DHT12
温湿度センサDHT12です。センサで取得した温度を知ることができます。

![](./image.jpg)

## wired(obniz,  {vcc , sda, scl, gnd} )
obniz Boardに温度センサをつなぎます。

```javascript
// Javascript Example
var sensor = obniz.wired("DHT12",{scl:26,sda:0});
```

## [await] getAllDataWait()
現在の温湿度を計測して返します。

```javascript
// Javascript Example
let device = obniz.wired("DHT12",{scl:26,sda:0});

let data = await device.getAllDataWait();
console.log(data);
    
```


## [await] getTempWait()
現在の温度を計測して返します。単位は摂氏(°C)です。

```javascript
// Javascript Example
let device = obniz.wired("DHT12",{scl:26,sda:0});

let data = await device.getTempWait();
console.log(data);
    
```

## [await] getHumdWait()
現在の湿度を計測して返します。単位は%です。


```javascript
// Javascript Example
let device = obniz.wired("DHT12",{scl:26,sda:0});

let data = await device.getHumdWait();
console.log(data);
    
```
