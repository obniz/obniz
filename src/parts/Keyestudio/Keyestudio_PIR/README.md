# Keyestudio PIR

Keyestudio PIR sensor. It is used tot detects human/animals' motion.  

![](image.jpg)


## wired(obniz, {signal [,vcc, gnd]})

connect to the obniz Board.  

name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | Signal pin outputs value of sensor(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC for sensor(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND for sensor(- pin of Keyestudio)


```Javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_PIR", {signal:0, vcc:1, gnd:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```

## onchange = function(value)

It called when something changed.  
It humans is closing to a sensor, this function will called with value `true`.  
If a humans leaves or if a human stops moving, this function will called with value `false`.  
After `true`, it basically becomes` false` immediately.

```Javascript
// Javascript Example
var sensor = obniz.wired("Keyestudio_PIR", {signal:0, vcc:1, gnd:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```
