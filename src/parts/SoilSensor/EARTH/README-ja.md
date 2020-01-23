# Soil Moisture Sensor - EARTH


M5STACK用土壌湿度センサEARTHユニットです。土壌の湿度を取得できます。  
アナログ・デジタルの出力を持っています。


## wired(obniz, { aout, dout, vcc, gnd })
obniz BoardにEARTHユニットをつなぎます。
白線、黄線、赤線、黒線がそれぞれaout、dout、vcc、gndに対応しています。


```javascript
// JavaScript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
```

## onchange = function(value)
EARTHユニットのアナログ出力の値に変化があった場合にcallback関数を呼び出します。

```javascript
// Javascript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
sensor.onchange = function(value){
  console.log(value)
};
```


## [await] getAnalogHumidityWait()
EARTHユニットのアナログ出力を読み取って返します。

```javascript
// Javascript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
var value = await sensor.getAnalogHumidityWait();
console.log('Humidity Level:' + value);
```


## [await] getDigitalHumidityWait()
EARTHユニットのデジタル出力を読み取って返します。

```javascript
// Javascript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
var value = await sensor.getDigitalHumidityWait();
if (value) {
    console.log('Humidity level is toohigh!');
}
```
