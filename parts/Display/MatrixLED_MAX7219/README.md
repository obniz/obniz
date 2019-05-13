# MatrixLED_MAX7219
Dot matrix LED. driver: MAX7219.

![](./image.jpg)

[http://akizukidenshi.com/catalog/g/gM-09984/](http://akizukidenshi.com/catalog/g/gM-09984/)

![](./max7129.jpg)


<iframe width="560" height="315" src="https://www.youtube.com/embed/5teMmFK1_FY" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## wired(obniz,  { clk, cs, din, gnd, vcc});

1. vcc: power supply
2. gnd: gnd.
3. din: spi MOSI pin.
4. cs: chip select
 
![](./wired.png)

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
```

## init(width, height)
initialize module.
if one module has 8*8 led and two modules are connected then
```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_MAX7219",  { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*2, 8);
```

## brightness(value)
value: 0 to 15;

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*2, 8);
matrix.brightness(7);
```

## draw(ctx)
In html5, Canvas is avaiable to draw.
pass canpas context to this function to show it on matrix

obniz.util.createCanvasContext() will create Canvas DOM to body.
See more detail on obniz util document's.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*4, 8);
matrix.brightness(7);

const ctx = obniz.util.createCanvasContext(matrix.width, matrix.height);
ctx.fillStyle = "black";
ctx.fillRect(0, 0, matrix.width, matrix.height);
ctx.fillStyle = "white";
ctx.font = "9px sans-serif";
ctx.fillText('Hello World', 0, 7);

matrix.draw(ctx);
```

## clear()
clear all.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_MAX7219",  { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*4, 8);
matrix.clear();
```

## test()
test all unit.
It will show last image.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*4, 8);
matrix.test();
```