# USB

Simply, Supplying power to usb accesorries.
Control USB light, etc with your obniz Board.

![](./image.jpg)

## wired(obniz, {vcc, gnd})

```javascript
// Javascript Example
var usb = obniz.wired("USB" , {gnd:0, vcc:3} );
usb.on();
```

## on()

Start supplying power to usb.

```javascript
// Javascript Example
var usb = obniz.wired("USB" , {gnd:0, vcc:3} );
usb.on();
```


## off()

Stop supplying power to usb.

```javascript
// Javascript Example
var usb = obniz.wired("USB" , {gnd:0, vcc:3} );
usb.on();
await obniz.wait(1000);
usb.off();
```