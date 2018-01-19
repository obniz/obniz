# Temperature Sensor - LM35DZ

## wired(obniz, vcc, output, gnd)
```javascript
var tempsens = obniz.wired("LM35DZ", 0, 1, 2);
```

## onChange(callback(temp))
callback function for temperature change.
Unit of temp is Celsius

```javascript
var tempsens = obniz.wired("LM35DZ", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp)
})
```