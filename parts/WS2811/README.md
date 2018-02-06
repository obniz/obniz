# WS2811
Full color LED driver.


## wire

connect VDD and GND to obniz and drive it.
And, wire DIN(Data in) to obniz. and write a code below

```Javascript
var led = obniz.wired("WS2811", 0); // DIN is connected to obniz io 0
```

```Javascript
var led = obniz.wired("WS2811", 0); // DIN is connected to obniz io 0
led.rgb(0xFF, 0xFF, 0xFF);
```