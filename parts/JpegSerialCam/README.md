# JpegSerialCam
JpegCamera PTC06

```Javascript
// Example
var cam = obniz.wired("JpegSerialCam", 0, 1, 2, 3);
await cam.startwait();
var imagedata = await cam.takewait();
```

<p data-height="494" data-theme-id="32184" data-slug-hash="jZMNBQ" data-default-tab="js,result" data-user="obniz" data-embed-version="2" data-pen-title="Parts: JpegSerialCam" class="codepen">See the Pen <a href="https://codepen.io/obniz/pen/jZMNBQ/">Parts: JpegSerialCam</a> by obniz (<a href="https://codepen.io/obniz">@obniz</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## wire(obniz, {vcc, tx, rx, gnd})
connect PowerSupply and UART.
tx is obniz -> cam data line.
rx is obniz <- cam data line.

```Javascript
const cam = obniz.wired("JpegSerialCam", {vcc:0, tx:1, rx:2, gnd:3});
```

## startwait({baud:baudrate})
start camera.
It takes around 2.5 second.

Default Baudrate = 38400
```Javascript
await cam.startwait(); // baud = 38400
```
You can specify baudrate
```Javascript
await cam.startwait({baud: 115200});
```

## setResolusionWait(resolution)
set image resolution
This configration consists even after power off.

1. "640*480" (image size around 40kb)
2. "320*240" (image size around 12kb)
3. "160*120" (image size arond 4kb)

are available.
data size depends on what you take.
```Javascript
await cam.startwait({baud: 115200});
await cam.setResolusionWait("640*480");
```

## setBaudWait(baud)
set baudrate of cam.
This configration consists even after power off.

1. 9600
2. 19200
3. 38400
4. 57600
5. 115200

are avaiable.
High-speed is better. But, if the Wifi network speed is slow, then obniz will lost the data when high-speed.

```Javascript
await cam.startwait({baud: 38400});
await cam.setBaudWait(115200);
await cam.takewait(); // baud is already changed to 115200.
```

## takewait()
take a photo and return a byte array.

```Javascript
await cam.startwait();
var imagedata = await cam.takewait();
```

## arrayToBase64(bytearray)
convert bytearray to base64 string.
It is useful when you want to print image to image tag

```Javascript
await cam.startwait();
const imagedata = await cam.takewait();
document.getElementById("ItemPreview").src = "data:image/png;base64," + cam.arrayToBase64(imagedata);
```