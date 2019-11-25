# WS2811
Full color LED driver.
Not only one LED. Capable of chaining leds.

![](./image.jpg)

WS2811 is embed in various Full Color LEDs. (In the photo `PL9823` is used)


## wire({din, [vcc, gnd]})
connect VDD and GND to obniz Board and drive it.
And, wire DIN(Data in) to obniz Board. and write a code below


![](./wired.png)

```Javascript
// Javascript Example
var leds = obniz.wired("WS2811", {gnd:0, vcc: 1, din: 2});
leds.rgbs([
  [0xFF, 0x00, 0x00], // red
  [0x00, 0x00, 0xFF]  // blue
])
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
var led = obniz.wired("WS2811", {gnd:0, vcc: 1, din: 2});
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
var led = obniz.wired("WS2811", {gnd:0, vcc: 1, din: 2});
led.hsv(180, 0.5, 1);
```

## rgbs([[r,g,b],,,,])
change colors.
You can specify colors of chained leds.
max chain length is 85(It depends on SPI max length)
```Javascript
// Javascript Example
var led = obniz.wired("WS2811", {gnd:0, vcc: 1, din: 2});
led.rgbs([
  [0xFF, 0x00, 0x00], // red
  [0x00, 0x00, 0xFF]  // blue
])
```
## hsvs([[r,g,b],,,,])
change colors.
You can specify colors of chained leds.
max chain length is 85(It depends on SPI max length)
```Javascript
// Javascript Example
var led = obniz.wired("WS2811", {gnd:0, vcc: 1, din: 2});
led.hsvs([
  [180, 0.5, 1],
  [0, 1, 1]
])
```