# Temperature Sensor - LM60
Temperature sensor LM60BIZ/LM60CIM

## wired(obniz, vcc, output, gnd)

```javascript
// Example
var tempsens = obniz.wired("LM60", 0, 1, 2);
```

## onChange(callback)
callback function for temperature change
Unit is Celsius.
It's step is 1.6 degree.
Ex. 20.1→21.7→23.3
```javascript
// Example
var tempsens = obniz.wired("LM60", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp);
})
```