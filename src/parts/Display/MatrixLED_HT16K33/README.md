# MatrixLED_HT16K33
Dot matrix LED. driver: HT16K33
![](image.jpg)
## wired(obniz,  { vcc, gnd, sda, scl, address　});

Connect a driver to an obniz.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3 });
```

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3, address: 0x71 });
```


In some devices, the positions of the GND and VCC pins may be reversed.
![](./check-keystudio_MatrixLED.jpg)
If you look like the picture above, you should also reverse the pin you specify in obniz.wired

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:1, vcc:0, sda:2, scl:3 });
```


## init(width)
initialize module.
if one module has 8*8 led and two modules are connected then
```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3 });
matrix.init(8);
```

## brightness(value)
value: 0 to 15;

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3 });
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
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3 });
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

## dots(dotsArray)

Can be turned on in dot units.
 
 ```Javascript
 // Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3 });
matrix.init(8);
matrix.brightness(7);
const dots = [1,2,4,8,16,32,64,128]
matrix.dots(dots);
 ```

## clear()
clear all.

```Javascript
// Javascript Example
const matrix = obniz.wired("MatrixLED_HT16K33", { gnd:0, vcc:1, sda:2, scl:3 });
matrix.init(8);
matrix.clear();
```
