# Temperature Sensor - S8100B



![photo of AnalogTemperatureSensor](./wired.png)



## wired(obniz, {vcc, output, gnd})
obniz Boardに温度センサをつなぎます。
```javascript
// Javascript Example
var tempsens = obniz.wired("S8100B", { gnd:0 , output:1, vcc:2});
```

## onchange
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。
```javascript
// Javascript Example
var tempsens = obniz.wired("S8100B", { gnd:0 , output:1, vcc:2});
tempsens.onchange = function(temp){
console.log(temp);
};
```


## [await]getWait

温度センサの値を一度だけ取得します
温度は摂氏で返されます。

```javascript
// Javascript Example
var tempsens = obniz.wired("S8100B", { gnd:0 , output:1, vcc:2});
var temp = await tempsens.getWait();
console.log(temp);
``` 