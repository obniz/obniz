# Temperature Sensor - LM61
Temperature sensor LM61BIZ/LM61CIZ

## wired(obniz, {vcc, output, gnd})

```javascript
var tempsens = obniz.wired("LM61", {vcc:0, output:1, gnd:2});

```

## onchange
callback function for temperature change
Unit is Celsius.
It's step is 1 degree.

```javascript
var tempsens = obniz.wired("LM61", {vcc:0, output:1, gnd:2});
tempsens.onchange ;= function(temp){
  console.log(temp);
}
```