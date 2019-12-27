# HC-SR505

It is used for detects humans/animals.

![](image.jpg)


## wired(obniz, {signal [,vcc, gnd]})

It has three pins. Connect them to an obniz directly.

```Javascript
// Javascript Example
var sensor = obniz.wired("HC-SR505", {vcc:0, signal:1, gnd:2});
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
var sensor = obniz.wired("HC-SR505", {vcc:0, signal:1, gnd:2});
sensor.onchange = function(val){
  console.log(val ? 'Moving Something!' : 'Nothing moving');
}
```

## [await] getWait()

Get sensor value once.


```Javascript
// Javascript Example
var sensor = obniz.wired("HC-SR505", {vcc:0, signal:1, gnd:2});
var val = await sensor.getWait();
console.log(val ? 'Moving Something!' : 'Nothing moving');
```
