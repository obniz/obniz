# LED
LED bright by supplying voltage.
It has two pins anode and cathode.
connect anode to plus and cathode to minus then it bright.
anode is a little bit longer than cathode.
![](./led.jpg)

## obniz.wired("LED", {anode, cathode})
anode is loger leg.
specify obniz io numbers you connected LED.

![](./wired.png)

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1}); // io0 is connected to anode, io1 is cathode
led.on();
```


```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0}); // io0 is anode. cathode is connected obniz GND other way.
led.on();
```
## on()
Simply, Turning on a LED.
It provide 5V to LED.

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.on();
```

![](./led_on.jpg)

## off()
Turning off a LED.

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.off();
```

## output(value)
on, off a LED regarding value.

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.output(true);
```

## blink(interval_ms)
Start blinking a LED.
default interval is 100msec
```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.blink(); // 100msec
```

## endBlink()
Stop blinking.
LED stops last state.
```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.blink();
led.endBllink();
```