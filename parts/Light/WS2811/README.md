# WS2811
Full color LED driver.
Capable of chaining leds.

```Javascript
// Javascript Example
var leds = obniz.wired("WS2811", {vcc: 0, gnd:1, din: 2});
leds.rgbs([
  [0xFF, 0x00, 0x00], // red
  [0x00, 0x00, 0xFF]  // blue
])
```

## wire
connect VDD and GND to obniz and drive it.
And, wire DIN(Data in) to obniz. and write a code below

```Javascript
// Javascript Example
var led = obniz.wired("WS2811", {vcc: 0, gnd:1, din: 2});
```
vcc and gnd is optional

```Javascript
// Javascript Example
var led = obniz.wired("WS2811", {din: 2});
```

## rgb(red, green, blue)
change color.
When you chaining LED, this will change only top of leds.
```Javascript
// Javascript Example
var led = obniz.wired("WS2811", {vcc: 0, gnd:1, din: 2});
led.rgb(0xFF, 255, 0); // Yellow
```

## hsv(hue, saturation, value)
change color from hsv values.
When you chaining LED, this will change only top of leds.

hue : 0 ~ 360
saturation : 0 ~ 1
value : 0 ~ 1
```Javascript
// Javascript Example
var led = obniz.wired("WS2811", {vcc: 0, gnd:1, din: 2}); // DIN is connected to obniz io 0
led.hsv(180, 0.5, 1);
```

## rgbs([[r,g,b],,,,])
change colors.
You can specify colors of chained leds.
```Javascript
// Javascript Example
led.rgbs([
  [0xFF, 0x00, 0x00], // red
  [0x00, 0x00, 0xFF]  // blue
])
```
## hsvs([[r,g,b],,,,])
change colors.
You can specify colors of chained leds.
```Javascript
// Javascript Example
led.hsvs([
  [180, 0.5, 1],
  [0, 1, 1]
])
```