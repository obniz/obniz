# Display (obniz.display)
Here we will show letters and pictures on OLED display on obniz.

![](./images/obniz_display_sphere.gif)

## clear();
Clear the display.

```Javascript
// Javascript Example
obniz.display.clear();
```
## print(string);
Print text on display.

```Javascript
// Javascript Example
obniz.display.print("Hello!");
```

With browser, UTF8 string is available. (It does not work with node.js. Please use display.draw())
```javascript
// Javascript Example
obniz.display.font('Serif',18)
obniz.display.print("Hello World🧡")
```
![](./images/obniz_display_print.jpg)

## pos(x, y);
(It does not work with node.js. Please use display.draw())
 
It changes the display position of a text. If you are using print() to display a text, position it to top left.
```javascript
// Javascript Example
obniz.display.pos(0,30);
obniz.display.print("YES. こんにちは");
```
![](./images/obniz_display_pos.jpg)

## font(fontFamilyName, fontSize);
(It does not work with node.js. Please use display.draw())
 
This changes the font.
The options for fontFamily and fontSize depend on your browser.

The default font is Arial 16px.
If you set the parameter to null, you will be using the default font.
```javascript
// Javascript Example
obniz.display.font('Avenir',30)
obniz.display.print("Avenir")


obniz.display.font(null,30) //default font(Arial) 30px
obniz.display.font('Avenir') //Avenir with default size(16px)
```
![](./images/obniz_display_samples3.jpg)
![](./images/obniz_display_samples2.jpg)
![](./images/obniz_display_samples4.jpg)

## line(start_x, start_y, end_x, end_y);
(It does not work with node.js. Please use display.draw())
 
Now we draw a line between two points.
```javascript
// Javascript Example
obniz.display.line(30, 30, 100, 30);
obniz.display.rect(20, 20, 20, 20);
obniz.display.circle(100, 30, 20);

obniz.display.line(60, 50, 100, 30);
obniz.display.rect(50, 40, 20, 20, true);
obniz.display.line(50, 10, 100, 30);
obniz.display.circle(50, 10, 10, true);
```
![](./images/obniz_display_draws.jpg)

## rect(x, y, width, height, fill);
(It does not work with node.js. Please use display.draw())
 
This draws a rectangle.
```javascript
// Javascript Example
obniz.display.rect(10, 10, 20, 20);
obniz.display.rect(20, 20, 20, 20, true); // filled rect
```

## circle(x, y, radius, fill);
(It does not work with node.js. Please use display.draw())
 
This draws a circle.
```javascript
// Javascript Example
obniz.display.circle(40, 30, 20);
obniz.display.circle(90, 30, 20, true); // filled circle
```
## drawing(mode)

You can specify to transfer the displayed data or not. This affects only the functions that use canvas like `clear/print/line/rect/circle/draw`.

Use `false` to stop updating OLED and `true` to restart updating.

```javascript
// Javascript Example
obniz.display.drawing(false);
for (var i=0;i<100; i++) {
  var x0 = Math.random() * 128;
  var y0 = Math.random() * 64;
  var x1 = Math.random() * 128;
  var y1 = Math.random() * 64;
  obniz.display.clear();
  obniz.display.line(x0, y0, x1, y1);
}
obniz.display.drawing(true);
```

## qr(data, correction)
This shows QR code with given text and correction level.
The correction level can be

1. L
2. M(default)
3. Q
4. H

H is the strongest error correction.

```Javascript
// Javascript Example
obniz.display.qr("https://obniz.io")
```

## raw([0,1,2,,,,]);

1 bit represents 1 dot. 1=white, 0=black.
1 byte is part of one line.
The order is as below.  
{1byte} {2byte} {3byte}...{16byte}  
{17byte} {18byte} {19byte}...  
.....  
.....................{1024byte}  

```javascript
obniz.display.raw([255, 255,,,,,])// must be 128*64 bits(=1024byte)
```

![](./images/obniz_display_sphere.gif)

## draw(context)
draw OLED from HTML5 Canvas context.
With node-canvas, this works with node.js.

```javascript
// 1. load existing
let ctx = $("#canvas")[0].getContext('2d');
// 2. create new canvas dom and load it.
let ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);

// 3. running with node.js
//    npm install canvas. ( version 2.0.0 or later required )
const { createCanvas } = require('canvas');
const canvas = createCanvas(128, 64); 
const ctx = canvas.getContext('2d');

ctx.fillStyle = "white";
ctx.font = "30px Avenir";
ctx.fillText('Avenir', 0, 40);

obniz.display.draw(ctx);
```

## draw(context)
draw OLED from HTML5 Canvas context.
With node-canvas, this works with node.js.

```javascript
// 1. load existing
let ctx = $("#canvas")[0].getContext('2d');
// 2. create new canvas dom and load it.
let ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);

// 3. running with node.js
//    npm install canvas. ( version 2.0.0 or later required )
const { createCanvas } = require('canvas');
const canvas = createCanvas(128, 64); 
const ctx = canvas.getContext('2d');

ctx.fillStyle = "white";
ctx.font = "30px Avenir";
ctx.fillText('Avenir', 0, 40);

obniz.display.draw(ctx);
```

UTF8 Texts

![](./images/obniz_display_samples0.jpg)

Tilt Text

![](./images/obniz_display_samples1.jpg)



