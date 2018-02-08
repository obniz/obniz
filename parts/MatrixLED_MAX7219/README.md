# MatrixLED_MAX7219
Dot matrix LED. driver: MAX7219.
[http://akizukidenshi.com/catalog/g/gM-09984/](http://akizukidenshi.com/catalog/g/gM-09984/)

<iframe width="560" height="315" src="https://www.youtube.com/embed/5teMmFK1_FY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

```Javascript

// initialize
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
matrix.init(8*4, 8);
matrix.brightness(7);

// draw things to Canvas context
const ctx = obniz.util.createCanvasContext(matrix.width, matrix.height);
ctx.fillStyle = "black";
ctx.fillRect(0, 0, matrix.width, matrix.height);
ctx.fillStyle = "white";
ctx.font = "9px sans-serif";
ctx.fillText('Helloこんにちは', 0, 7);

// draw canvas context to matrix
matrix.drawCanvasContext(ctx);
```

<p data-height="300" data-theme-id="32184" data-slug-hash="bLBJxe" data-default-tab="js,result" data-user="obniz" data-embed-version="2" data-pen-title="Parts: DotMatrixText" class="codepen">See the Pen <a href="https://codepen.io/obniz/pen/bLBJxe/">Parts: DotMatrixText</a> by obniz (<a href="https://codepen.io/obniz">@obniz</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## wired(obniz, vcc, gnd, din, cs, clk, nc)

1. vcc: power supply
2. gnd: gnd.
3. din: spi MOSI pin.
4. cs: chip select
5. nc: pin for MISO.(not necessary to connect. but spi use this).
 
```Javascript
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
```

## init(width, height)
initialize module.
if one module has 8*8 led and two modules are connected then
```Javascript
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
matrix.init(8*2, 8);
```

## brightness(value)
value: 0 to 15;

```Javascript
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
matrix.init(8*2, 8);
matrix.brightness(7);
```

## drawCanvasContext(ctx)
In html5, Canvas is avaiable to draw.
pass canpas context to this function to show it on matrix

obniz.util.createCanvasContext() will create Canvas DOM to body.
See more detail on obniz util document's.

```Javascript
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
matrix.init(8*4, 8);
matrix.brightness(7);

const ctx = obniz.util.createCanvasContext(matrix.width, matrix.height);
ctx.fillStyle = "black";
ctx.fillRect(0, 0, matrix.width, matrix.height);
ctx.fillStyle = "white";
ctx.font = "9px sans-serif";
ctx.fillText('Helloこんにちは', 0, 7);

matrix.drawCanvasContext(ctx);
```

## clear()
clear all.

```Javascript
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
matrix.init(8*4, 8);
matrix.clear();
```

## test()
test all unit.
It will show last image.

```Javascript
const matrix = obniz.wired("MatrixLED_MAX7219", 0, 1, 2, 3, 4, 5);
matrix.init(8*4, 8);
matrix.test();
```