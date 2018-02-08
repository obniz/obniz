# Display
OLED display on obniz.

## display.clear();
clear the display.

```Javascript
// Example
obniz.display.clear();
```
## display.print(string);
print text on display.

```Javascript
// Example
obniz.display.print("Hello!");
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
// Example
obniz.display.qr("https://obniz.io")
```

## display.raw([0,1,2,,,,]);

1 bit represents 1 dot. 1=white, 0=black.
1 byte is part of one line.
Order is same like.  
{0byte} {1byte} {2byte}  
{3byte} {4byte} {5byte}...  

```javascript
obniz.display.raw([255, 255,,,,,])// msut be 128*64 bytes
```

## drawCanvasContext(context)
draw OLED from HTML5 Canvas context.

```javascript

// load existing
const ctx = $("#canvas")[0].getContext('2d');
// create new canvas dom and load it.
// const ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);

ctx.fillStyle = "white";
ctx.font = "30px Avenir";
ctx.fillText('Avenir', 0, 40);

obniz.display.drawCanvasContext(ctx);
```

### canvas rendering samples
![](./image/obniz_display_sphere.gif)

Full code below

<p data-height="300" data-theme-id="32184" data-slug-hash="yvVdre" data-default-tab="js,result" data-user="obniz" data-embed-version="2" data-pen-title="Parts: obniz.display Sphere" class="codepen">See the Pen <a href="https://codepen.io/obniz/pen/yvVdre/">Parts: obniz.display Sphere</a> by obniz (<a href="https://codepen.io/obniz">@obniz</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### canvas text rendering samples

UTF8 Text

![](./image/obniz_display_samples0.jpg)

Tilt Text

![](./image/obniz_display_samples1.jpg)

Changing Font

![](./image/obniz_display_samples2.jpg)
![](./image/obniz_display_samples3.jpg)
![](./image/obniz_display_samples4.jpg)

