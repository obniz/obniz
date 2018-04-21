# Soil Moisture Sensor - SEN0114
It detect moisture level in soil.


## wired(obniz, { vcc, output, gnd} )

connect vcc,output,gnd to an obniz.

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114", {vcc:0, output:1, gnd:2});
```

## onchange = function(value)

callback function called when the value was changed.

Manufacture data says moisture level increse with moisture like

1. 0~1.47: Dry
2. 1.47~3.43: Wet
3. 3.43~4.20: In Walter

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114", {vcc:0, output:1, gnd:2});
sensor.onchange = function(value){
  console.log(value)
};
```
## [await] getHumidityWait()

Measure and response current value.

```javascript
// Javascript Example
var sensor = obniz.wired("SEN0114",  {vcc:0, output:1, gnd:2});
var value = await sensor.getHumidityWait();
console.log('Humidity Level:' + value);
```
