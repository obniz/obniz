# Temperature Sensor - LM35DZ

## wired(obniz, {output, vcc, gnd})
```javascript
var tempsens = obniz.wired("LM35DZ", {output:0, vcc:1, gnd:2});
```

## onchange 
callback function for temperature change.
Unit of temp is Celsius

```javascript
var tempsens = obniz.wired("LM35DZ", {output:0, vcc:1, gnd:2});
tempsens.onchange = function(temp){
  console.log(temp)
};
```