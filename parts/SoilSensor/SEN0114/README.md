# Soil Moisture Sensor - SEN0114

You can measure Soil Moisture.
The module return value in range 0〜4.2 .

0~1.47: dry soil
1.47~3.43: humid soil
3.43~4.20: in water


## wired(obniz, { vcc, output, gnd} )
```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114", {vcc:0, output:1, gnd:2});
```

## onchange
Register callback function for value change.

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114", {vcc:0, output:1, gnd:2});
sensor.onchange = function(humidity){
  console.log(humidity)
};
```
## [await] getHumidityWait()
Get value once.

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114",  {vcc:0, output:1, gnd:2});
var humid = await sensor.getHumidityWait();
console.log('Humidity Level:' + humid);
```
