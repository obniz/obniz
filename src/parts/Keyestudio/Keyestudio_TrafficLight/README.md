# Keyestudio_TrafficLight
Keyestudio traffic light module, which has green, yellow and red LEDs.  

![]()


## obniz.wired("Keyestudio_TrafficLight", {green, yellow, red [, gnd]})
connect to obniz Board.  

name | type | required | default | description
--- | --- | --- | --- | ---
green | `number(obniz Board io)` | yes |  &nbsp; | green LED(G pin of Keyestudio)
yellow | `number(obniz Board io)` | yes |  &nbsp; | yellow LED(Y pin of Keyestudio)
red | `number(obniz Board io)` | yes |  &nbsp; | red LED(R pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND for LED(GND pin of Keyestudio)


```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
```


## on(led)
turn on a LED.  
Specify one of `green`, `yellow` and `red` in the `led` argument.  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
light.on("green");
```


## off(led)
turn off a LED.  
Specify one of `green`, `yellow` and `red` in the `led` argument.  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
light.on("green");
await obniz.wait(1000);
light.off("green");
```


## exclusive_on(led)
turn on a LED exclusively. That is, one LED turns on after turning off the other LEDs.  
This function is useful when this module is used as the traffic light, because it guarantees that only one LED is lit.  
Specify one of `green`, `yellow` and `red` in the `led` argument.  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, geeen:1, yellow:2, red:3});
light.exclusive_on("green");
await obniz.wait(1000);
light.exclusive_on("yellow");
await obniz.wait(1000);
light.exclusive_on("red");
```
