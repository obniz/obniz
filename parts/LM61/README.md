# Temperature Sensor - LM61
Temperature sensor LM61BIZ/LM61CIZ

## wired(obniz, vcc, output, gnd)

```javascript
var tempsens = obniz.wired("LM61", 0, 1, 2);
```

## onChange(callback(temp))
callback function for temperature change
Unit is Celsius.
It's step is 1 degree.

```javascript
var tempsens = obniz.wired("LM61", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp);
})
```