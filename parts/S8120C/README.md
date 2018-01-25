# Temperature Sensor - S-8120C

## wired(obniz, vcc, gnd, output)
```javascript
var tempsens = obniz.wired("S8120C", 0, 1, 2);
```

## onChange(callback(temp))
callback function for temperature change.
Unit of temp is Celsius

```javascript
var tempsens = obniz.wired("S8120C", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp)
})
```
