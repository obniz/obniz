# Keyestudio_TrafficLight
Keyestudio traffic light module, which has green, yellow and red LEDs.  

![](image.jpg)


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
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
```

## single(led)
turn on a LED exclusively. That is, one LED turns on after turning off the other LEDs.  
This function is useful when this module is used as the traffic light, because it guarantees that only one LED is lit.  
Specify one of `green`, `yellow` and `red` in the `led` argument.  

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.single("green");
```


## next()
Lights in order of blue, yellow, and red.

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
while (true){
    light.next();
    await obniz.wait(1000);
}
```

## LED Control

[https://obniz.io/sdk/parts/LED/README.md](https://obniz.io/sdk/parts/LED/README.md)

Specify one of `green`, `yellow` and `red`.  

- on()

Simply, Turning on a LED.
It provide 5V to LED.

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.green.on();
light.yellow.on();
light.red.on();
```

- off()

Turning off a LED.
```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.green.off();
light.yellow.off();
light.red.off();
```

- blink(interval_ms)

Start blinking a LED.
default interval is 100msec

```javascript
// JavaScript Example
var light = obniz.wired("Keyestudio_TrafficLight", {gnd:0, green:1, yellow:2, red:3});
light.yellow.blink();
```



