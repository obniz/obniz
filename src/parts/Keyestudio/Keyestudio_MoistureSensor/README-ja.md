# Keyestudio_MoistureSensor

![](image.jpg)

Keyestudio社製土壌湿度センサです。土壌の湿度を取得できます。
返される値は0~4.2の範囲で、湿度の目安は以下の通りです。

- 0~1.47:乾いた土壌
- 1.47~3.43:湿った土壌
- 3.43~4.20:水中

## wired(obniz, {signal [, vcc, gnd]})
obniz Boardに土壌湿度センサをつなぎます。

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal 土壌センサの値を示す端子(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(- pin of Keyestudio)


```javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_MoistureSensor", {signal:0, vcc:1, gnd:2});
```

## onchange
土壌湿度センサの値に変化があった場合にcallback関数を呼び出します。

```javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_MoistureSensor", {signal:0, vcc:1, gnd:2});
sensor.onchange = function(value){
  console.log(value)
};
```

## [await] getHumidityWait()
土壌湿度センサの値を計測して返します。

```javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_MoistureSensor", {signal:0, vcc:1, gnd:2});
var value = await sensor.getHumidityWait();
console.log('Humidity Level:' + value);
```
