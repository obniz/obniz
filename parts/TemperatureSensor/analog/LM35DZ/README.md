# Temperature Sensor - LM35DZ
Temperature and Humidity sensor LM35DZ




![photo of AnalogTempratureSensor](./wired.png)




## wired(obniz, {vcc, gnd, output})
```javascript
var tempsens = obniz.wired("LM35DZ", { gnd:0 , output:1, vcc:2});
```

## onchange
callback function for temperature change.
Unit of temp is Celsius

```javascript
var tempsens = obniz.wired("LM35DZ",   { gnd:0 , output:1, vcc:2});
tempsens.onchange = function(temp){
console.log(temp)
};
```
 

