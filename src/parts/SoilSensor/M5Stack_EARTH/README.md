# Soil Moisture Sensor - EARTH

The soil moisture sensor, EARTH UNIT for M5STACK.  
It detect moisture level in soil.  
It has both analog and digital outputs.


## wired(obniz, { aout, dout, vcc, gnd })
connect EARTH UNIT to the obniz Board.  

```javascript
// JavaScript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
```


## onchange = function(value)
callback function called when the value was changed.

```javascript
// Javascript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
sensor.onchange = function(value){
  console.log(value)
};
```


## [await] getAnalogHumidityWait()
Measure and get current analog value once.

```javascript
// Javascript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
var value = await sensor.getAnalogHumidityWait();
console.log('Humidity Level:' + value);
```


## [await] getDigitalHumidityWait()
Measure and get current digital value once.

```javascript
// Javascript Example
var sensor = obniz.wired("EARTH", {aout: 0, dout: 1, vcc: 2, gnd: 3});
var value = await sensor.getDigitalHumidityWait();
if (value) {
    console.log('Humidity level is toohigh!');
}
```