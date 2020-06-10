# Grove_PressureSensor
Pressure sensor that can be used with Grove connectors.  
Returns the pressure acquired by the sensor between 0 and voltage.

![](image.jpg)

## wired(obniz, {[output, vcc, gnd, grove]});
Connects to the obniz device.  
The yellow, red, and black lines correspond to OUTPUT, VCC, and GND, respectively.

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
output | `number(obniz Board io)` | no |  &nbsp; | output pin
grove | `object` | no | &nbsp;  | grove interface object if a device has

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_PressureSensor", {grove: obniz.grove0});
```

## onchange = function(value){}
The callback function is called when there is a change in the value of the pressure sensor.

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_PressureSensor", {grove: obniz.grove0});
sensor.onchange = function(value){
  console.log(value)
};
```

## [await]getWait();
Measure the value of the pressure sensor only once.

```javascript
// Javascript Example
let sensor = obniz.wired("Grove_PressureSensor", {grove: obniz.grove0});
let value = await sensor.getWait();
console.log(value);
```
