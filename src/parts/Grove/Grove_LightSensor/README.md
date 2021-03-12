# Grove_LightSensor

Ambient light sensor.

![](image.jpg)

## wired(obniz, {[signal, vcc, gnd, grove]});

connect to the obniz device.  
yellow, red and black wires correspond to signal, vcc and gnd respectively.


name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
signal | `number(obniz Board iov)` | no |  &nbsp; | signal output pin
grove | `object` | no | &nbsp;  | grove interface object if a device has

```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {gnd:0, vcc:1, signal: 3});
```
  
If the device has a grove interface, it can be connected with just the parameter {grove: obniz.grove0}.
```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {grove: obniz.grove0});
```
This sensor is a three-terminal photo resistor.  When a voltage is applied to vcc and gnd, it generates a voltage according to the brightness.  
By using a resistor, the change in the voltage can be read.

## onchange = function(value)

Change callback of brightness change.  
It's value range is 0 to vcc.  
value will increase by brightness.
  
  
```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {grove: obniz.grove0});
sensor.onchange = function(value) {
  console.log(value);
}
```

## [await] getWait()

Get brightness only once.

```Javascript
// Javascript Example
let sensor = obniz.wired("Grove_LightSensor", {grove: obniz.grove0});
const value = await sensor.getWait();
console.log(value);
```
