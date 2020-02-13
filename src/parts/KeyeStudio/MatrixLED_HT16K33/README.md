# MatrixLED_HT16K33
Dot matrix LED. driver: HT16K33

## wired(obniz,  { vcc, gnd, sda, scl　});

Connect a driver to an obniz.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
```

## init(width)
initialize module.
if one module has 8*8 led and two modules are connected then
```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
matrix.init(8);
```

## brightness(value)
value: 0 to 15;

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
matrix.init(8);
matrix.brightness(7);
```

## draw(ctx)
In html5, Canvas is avaiable to draw.
pass canpas context to this function to show it on matrix

obniz.util.createCanvasContext() will create Canvas DOM to body.
See more detail on obniz util document's.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
matrix.init(8);
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
const matrix = obniz.wired("MatrixLED_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
matrix.init(8);
matrix.clear();
```
