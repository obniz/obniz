# USB

USBアクセサリに電力を供給します。
USBで光る電気や扇風機などをobniz Boardから操作できます。

![](./image.jpg)

## wired(obniz, {vcc, gnd})

```javascript
// Javascript Example
var usb = obniz.wired("USB" , {gnd:0, vcc:3} );
usb.on();
```

## on()

電源をONにします。

```javascript
// Javascript Example
var usb = obniz.wired("USB" , {gnd:0, vcc:3} );
usb.on();
```


## off()

電源をOFFにします。

```javascript
// Javascript Example
var usb = obniz.wired("USB" , {gnd:0, vcc:3} );
usb.on();
await obniz.wait(1000);
usb.off();
```