# Temperature Sensor - MCP9701


## wired(obniz, vcc, output, gnd)

```javascript
var tempsens = obniz.wired("MCP9701", 0, 1, 2);
```

## onChange(callback(temp))
callback function for temperature change
Unit is Celsius.

```javascript
var tempsens = obniz.wired("MCP9701", 0, 1, 2);
tempsens.onChange(function(temp){
  console.log(temp);
})
```