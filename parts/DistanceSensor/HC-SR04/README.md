# HC-SR04
Ultrasonic Distance Measurement Unit.


## wired(obniz, {vcc, triger, echo, gnd})

![photo of wired](./wired.png)
```javascript
  // Example
  var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, triger:2, vcc:3});
  hcsr04.measure(function( distance ){
    $("#print").text("distance " + distance + " mm")
  })
```

## measure(callback(distance))
measure distance.
default return unit is "mm". change by calling .unit()
```javascript
  var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, triger:2, vcc:3});
  $("#do").click(function(){
    hcsr04.measure(function( distance ){
      $("#print").text("distance " + distance + " mm")
    })
  })
```

## unit(unit)
change unit

1. "mm"(default)
2. "inch"

are available

```javascript
  var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, triger:2, vcc:3});
  hcsr04.unit("inch")
  $("#do").click(function(){
    hcsr04.measure(function( distance ){
      $("#print").text("distance " + distance + " inch")
    })
  })
```