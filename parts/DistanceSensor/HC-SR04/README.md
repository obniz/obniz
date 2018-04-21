# HC-SR04
Ultrasonic Distance Measurement Unit.


## wired(obniz, {vcc, trigger, echo, gnd})

![photo of wired](./wired.png)
```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.measure(function( distance ){
  console.log("distance " + distance + " mm")
})
```

## measure(callback(distance))
measure distance.
default return unit is "mm". change by calling .unit()
```javascript
// Javascript Example

var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.measure(function( distance ){
  onsole.log("distance " + distance + " mm")
})
```

## unit(unit)
change unit

1. "mm"(default)
2. "inch"

are available

```javascript
// Javascript Example
var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
hcsr04.unit("inch")
hcsr04.measure(function( distance ){
  console.log("distance " + distance + " inch")
})
```