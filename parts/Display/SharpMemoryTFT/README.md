# SharpMemoryTFT

Sharp memory TFT. High contract and low power consumption.

![](./image.jpg)

This library can drive Sharp Memory TFT (LS013B4DN04).

[Adafruit SHARP Memory Display Breakout - 1.3" 168x144](https://www.adafruit.com/product/3502)

[Adafruit SHARP Memory Display Breakout - 1.3" 96x96](https://www.adafruit.com/product/1393)

![](./sample.jpg)


## wired(obniz,  {[vcc, gnd, vcc_a, gnd_a, sclk, mosi, cs, disp, extcomin, extmode, width, height]} )

Wire a TFT to an obniz Board.
TFT is 3.3V. This library drive 5v to vin. Attention for using modules which doesn't have a regulator.
This library use one SPI.
specify pixels at width and height.

```javascript
// Javascript Example
mdisp = obniz.wired("SharpMemoryTFT", {vcc:0 , gnd:2 , sclk:3 , mosi:4, cs:5, width:144, height:168});
display.clear();

for (var i=0;i<10; i++) {
  var x = Math.random() * 144;
  var y = Math.random() * 168;
  var r = Math.random() * 168;
  display.circle(x, y, r, false);
  await obniz.wait(1);
}
```

## Draw methods

Draw methods are same as obniz.display except for qr.
See more detail at [display](https://obniz.io/doc/sdk/doc/display).

## Example of using Canvas context

```javascript
mdisp = obniz.wired("SharpMemoryTFT", {vcc:0 , gnd:2 , sclk:3 , mosi:4, cs:5, width:144, height:168});
mdisp.clear();

var canvas = document.getElementById('canvas');
if ( ! canvas || ! canvas.getContext ) { return false; }
var ctx = canvas.getContext('2d');
var img = new Image();
img.src = "Image address here";
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  mdisp.draw(ctx);
}
```
