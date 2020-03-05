# Keyestudio_HT16K33
複数LEDを操作するHT16K33チップと連携するクラスです。
Keyestudioの製品のサポートになります。
![](image.jpg)

## wired(obniz,  { vcc, gnd, sda, scl　});

obniz BoardにマトリックスLEDを接続します。

```Javascript
// Javascript Example
const matrix = obniz.wired("Keyestudio_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
```

## brightness(value)
明るさで、0~15が指定できます。

```Javascript
// Javascript Example
const matrix = obniz.wired("Keyestudio_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
matrix.brightness(7);
```

## draw(ctx)
HTML5のcanvasをそのまま描画します。html上でobniz Boardを使っている場合は

`obniz.util.createCanvasContext()`

を使うことで、canvasを簡単に生成できます。nodejsの場合はnode-canvasを使うことが出来ます。
あとは、そこに描画し、この関数に渡すと２値化されてディスプレイに表示されます。

```Javascript
// Javascript Example
const matrix = obniz.wired("Keyestudio_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
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

 ドット単位で点灯させることができます。
 
 ```Javascript
 // Javascript Example
 const matrix = obniz.wired("Keyestudio_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
 const dots = [1,2,4,8,16,32,64,128]
 matrix.draw(dots);
 ```

## clear()
すべてを消去します。

```Javascript
const matrix = obniz.wired("Keyestudio_HT16K33", { vcc:0, gnd:1, sda:2, scl:3 });
matrix.clear();
```
