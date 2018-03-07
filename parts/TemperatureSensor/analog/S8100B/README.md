# Temperature Sensor - S8100B
インピーダンスがない？


![photo of AnalogTempratureSensor](./wired.png)




## wired(obniz, {vcc, gnd, output})
```javascript
var tempsens = obniz.wired("S8100B", { gnd:1 , output:2, vcc:0});
```

## onchange
callback function for temperature change.
Unit of temp is Celsius

```javascript
var tempsens = obniz.wired("S8100B",   { gnd:1 , output:2, vcc:0});
tempsens.onchange = function(temp){
console.log(temp)
};
```
 

