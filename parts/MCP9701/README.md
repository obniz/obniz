# Temperature Sensor - MCP9701


## wired(obniz, {vcc, output, gnd})

```javascript
var tempsens = obniz.wired("MCP9701", {vcc:0, output:1, gnd:2});
```

## onchange
callback function for temperature change
Unit is Celsius.

```javascript
var tempsens = obniz.wired("MCP9701", {vcc:0, output:1, gnd:2});
tempsens.onchange = function(temp){
  console.log(temp);
};
```