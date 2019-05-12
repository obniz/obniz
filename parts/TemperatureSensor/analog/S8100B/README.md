# Temperature Sensor - S8100B
インピーダンスがない？


![photo of AnalogTemperatureSensor](./wired.png)




## wired(obniz, {vcc, gnd, output})
```javascript
// Javascript Example
var tempsens = obniz.wired("S8100B", { gnd:1 , output:2, vcc:0});
```

## onchange
callback function for temperature change.
Unit of temp is Celsius

```javascript
// Javascript Example
var tempsens = obniz.wired("S8100B",   { gnd:1 , output:2, vcc:0});
tempsens.onchange = function(temp){
console.log(temp)
};
```

## [await]getWait
get temperature change.
Unit of temp is Celsius

```javascript
// Javascript Example
var tempsens = obniz.wired("S8100B",   { gnd:1 , output:2, vcc:0});
var temp = await tempsens.getWait();
console.log(temp);
```
 

