# Temperature Sensor - S8100B





![photo of AnalogTempratureSensor](./wired.png)



## wired(obniz, {vcc, output, gnd})
Obnizに温度センサをつなぎます。
```javascript
var tempsens = obniz.wired("S8100B",  { gnd:0 , output:1, vcc:2});
```

## onchange
温度センサの値に変化があった場合にcallback関数を呼び出します。
温度は摂氏で返されます。
```javascript
var tempsens = obniz.wired("S8100B",  { gnd:0 , output:1, vcc:2});
tempsens.onchange = function(temp){
  console.log(temp);
};
```
 