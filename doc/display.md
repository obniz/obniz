# Display
OLED display on obniz.

![](./images/obniz_display_sphere.gif)

## display.clear();
clear the display.

```Javascript
// Javascript Example
obniz.display.clear();
```
## display.print(string);
print text on display.

```Javascript
// Javascript Example
obniz.display.print("Hello!");
```

With browser, UTF8 string available. (not works with node.js. please use display.draw())
```javascript
// Javascript Example
obniz.display.font('Serif',18)
obniz.display.print("Hello World🧡")
```
![](./images/obniz_display_print.jpg)

## display.pos(x, y);
(not works with node.js. please use display.draw())
 
changing left-top position of next print().
```javascript
// Javascript Example
obniz.display.pos(0,30);
obniz.display.print("YES. こんにちは");
```
![](./images/obniz_display_pos.jpg)

## display.font(fontFamilyName, fontSize);
(not works with node.js. please use display.draw())
 
changing font.
Options for fontFamily and fontSize depends on your browser.
```javascript
// Javascript Example
obniz.display.font('Avenir',30)
obniz.display.print("Avenir")
```
![](./images/obniz_display_samples3.jpg)
![](./images/obniz_display_samples2.jpg)
![](./images/obniz_display_samples4.jpg)

## display.line(start_x, start_y, end_x, end_y);
(not works with node.js. please use display.draw())
 
draw a line between two point.
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

## display.rect(x, y, width, height, fill);
(not works with node.js. please use display.draw())
 
draw a rect.
```javascript
// Javascript Example
obniz.display.rect(10, 10, 20, 20);
obniz.display.rect(20, 20, 20, 20, true); // filled rect
```

## display.circle(x, y, radius, fill);
(not works with node.js. please use display.draw())
 
draw a circle.
```javascript
// Javascript Example
obniz.display.circle(40, 30, 20);
obniz.display.circle(90, 30, 20, true); // filled circle
```


## display.qr(data, correction)
show QR code with given text and correction level.
correction level can be choosed from

1. L
2. M(default)
3. Q
4. H

H is the strongest error correction.

```Javascript
// Javascript Example
obniz.display.qr("https://obniz.io")
```

## display.raw([0,1,2,,,,]);

1 bit represents 1 dot. 1=white, 0=black.
1 byte is part of one line.
Order is same like.  
{1byte} {2byte} {3byte}...{16byte}  
{17byte} {18byte} {19byte}...  
.....  
.....................{1024byte}  

```javascript
obniz.display.raw([255, 255,,,,,])// msut be 128*64 bits(=1024byte)
```

![](./images/obniz_display_sphere.gif)

## display.draw(context)
draw OLED from HTML5 Canvas context.
With node-canvas, this works with node.js.

```javascript
// 1. load existing
let ctx = $("#canvas")[0].getContext('2d');
// 2. create new canvas dom and load it.
let ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);

// 3. runnning with node.js
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



