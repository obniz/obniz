# Temperature Sensor - LM35DZ
Temperature and Humidity sensor LM35DZ




![photo of AnalogTemperatureSensor](./wired.png)




## wired(obniz, {vcc, gnd, output})
```javascript
// Javascript Example
var tempsens = obniz.wired("LM35DZ", { gnd:0 , output:1, vcc:2});
```

## onchange
callback function for temperature change.
Unit of temp is Celsius

```javascript
// Javascript Example
var tempsens = obniz.wired("LM35DZ",   { gnd:0 , output:1, vcc:2});
tempsens.onchange = function(temp){
console.log(temp)
};
```

## [await]getWait
get temperature change.
Unit of temp is Celsius

```javascript
// Javascript Example
var tempsens = obniz.wired("LM35DZ",   { gnd:0 , output:1, vcc:2});
var temp = await tempsens.getWait();
console.log(temp);
```
 

