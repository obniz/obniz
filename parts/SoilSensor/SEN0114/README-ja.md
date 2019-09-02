# Soil Moisture Sensor - SEN0114

![](./image.jpg)

土壌湿度センサSEN0114です。土壌の湿度を取得できます。
返される値は0~4.2の範囲で、湿度の目安は以下の通りです。
0~1.47:乾いた土壌
1.47~3.43:湿った土壌
3.43~4.20:水中


## wired(obniz, { vcc, output, gnd} )
obniz Boardに土壌湿度センサをつなぎます。
0,1,2はそれぞれ温度センサの電源,GND,センサ出力へ接続してください。


![](./wired.png)

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114", {vcc:0,  gnd:1, output:2});
```

## onchange
土壌湿度センサの値に変化があった場合にcallback関数を呼び出します。

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114", {vcc:0,  gnd:1, output:2});
sensor.onchange = function(value){
  console.log(value)
};
```
## [await] getHumidityWait()
土壌湿度センサの値を計測して返します。

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114",  {vcc:0,  gnd:1, output:2});
var value = await sensor.getHumidityWait();
console.log('Humidity Level:' + value);
```
