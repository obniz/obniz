# PaPIRsVZ

Panasonic's PIR sensor. It is used tot detects humans/animals.
This sensor include filters. So Easy to separate signal from noises.

![](./image.jpg)


## wired(obniz, [signal [,vcc, gnd]])

It has three pins. Connect them to an obniz Board directly.

```Javascript
// Javascript Example
var sensor = obniz.wired("PaPIRsVZ", {gnd:0, signal:1, vcc:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```

## onchange = function(value)

It called when something changed.
It humans is closing to a sensor, this function will called with value `true`.
If a humans leaves or if a human stops moving, this function will called with value `false`.
It's fileter works. So called with false after soon called with true.

```Javascript
// Javascript Example
var sensor = obniz.wired("PaPIRsVZ", {gnd:0, signal:1, vcc:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```