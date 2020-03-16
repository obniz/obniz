# Grove_SoilMoisturesensor

![](image.jpg)

A soil humidity sensor that can be used with Grove. You can get the soil humidity.  
The value returned is in the range 0 to voltage, with higher humidity being value lower (closer to 0).

## wired(obniz, {[signal, vcc, gnd, grove]});

Connect to the obniz device.  
Yellow, red and black wires correspond to signal, vcc and gnd respectively.

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
signal | `number(obniz Board iov)` | no |  &nbsp; | signal output pin
grove | `object` | no | &nbsp;  | grove interface object if a device has

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {grove: obniz.grove0});
```

## onchange(value)
Callback function called when the value was changed.

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {grove: obniz.grove0});
sensor.onchange = function(value){
  console.log(value)
};
```
## [await] getWait()
Measure and get current value once.

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_SoilMoistureSensor", {grove: obniz.grove0});
let value = await sensor.getWait();
console.log('Humidity Level:' + value);
```
