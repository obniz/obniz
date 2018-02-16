# Temperature Sensor - LM60
Temperature sensor LM60BIZ/LM60CIM

## wired(obniz, {vcc, output, gnd})

```javascript
// Example
var tempsens = obniz.wired("LM60", {vcc:0, output:1, gnd:2});
```

## onchange
callback function for temperature change
Unit is Celsius.
It's step is 1.6 degree.
Ex. 20.1→21.7→23.3
```javascript
// Example
var tempsens = obniz.wired("LM60", {vcc:0, output:1, gnd:2});
tempsens.onchange = function(temp){
  console.log(temp);
};
```