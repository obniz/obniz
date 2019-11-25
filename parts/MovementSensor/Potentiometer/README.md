# Potentiometer

Potention Meter change it's resistor value regarding angle or position.
obniz Board can read resistor value by using AD.
It has three pins. between sides resistor values is constant. voltage of center pin moves within left and right side's voltage.

![](./image.jpg)

This parts can treat only 10 ohm to 100 k ohm.


## obniz.wired(obniz, {pin0, pin1, pin2})

pin0 and pin2 is side pins. It can be swapped. But position will be reversed.


![](./wired.png)

```Javascript
// Javascript Example
var meter = obniz.wired("Potentiometer", {pin0:0, pin1:1, pin2:2});
```
## onchange = function(position){}
called when rotated.
position value is within 0.0 to 1.0. so, center is 0.5.
```Javascript
// Javascript Example
var meter = obniz.wired("Potentiometer", {pin0:0, pin1:1, pin2:2});
meter.onchange = function(position) {
  console.log("position: "+position);
};
```