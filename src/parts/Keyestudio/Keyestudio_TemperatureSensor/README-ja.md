# Keyestudio_TemperatureSensor

Keyestudio社製温度センサです。センサで取得した温度を知ることができます。  

![](image.jpg)

## wired(obniz, {signal [, vcc, gnd]})
obniz Boardに温度センサをつなぎます。  

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal センサの値を示す端子(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(- pin of Keyestudio)


```javascript
// Javascript Example
var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {signal:0, vcc:1, gnd:2});
```

## onchange
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。
```javascript
// Javascript Example
var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {signal:0, vcc:1, gnd:2});
tempsens.onchange = function(temp){
console.log(temp);
};
```


## [await]getWait

温度センサの値を一度だけ取得します
温度は摂氏で返されます。

```javascript
// Javascript Example
var tempsens = obniz.wired("Keyestudio_TemperatureSensor", {signal:0, vcc:1, gnd:2});
var temp = await tempsens.getWait();
console.log(temp);
``` 
