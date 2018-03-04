# Temperature Sensor - S-8120C

## wired(obniz, {vcc, gnd, output})
```javascript
var tempsens = obniz.wired("S8120C", {vcc:0, gnd:1, output:2});
```

## onchange
callback function for temperature change.
Unit of temp is Celsius

```javascript
var tempsens = obniz.wired("S8120C", {vcc:0, gnd:1, output:2});
tempsens.onchange = function(temp){
  console.log(temp)
};
```
