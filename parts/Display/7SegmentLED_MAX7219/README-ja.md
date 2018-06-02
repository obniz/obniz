# 7SegmentLED_MAX7219
MAX7219に接続された7セグメントLEDを制御するクラスです。
MAX7219一つにつき最大8桁の7セグメントLEDを制御することができます。
また、連続してつなげることができるのも特徴です。


## wired(obniz,  { clk, cs, din, gnd, vcc});

1. vcc: 電源のプラスです。
2. gnd: 電源のマイナスです。
3. din: SPIの MOSI ピンです。
4. cs: チップ選択です。

チェーン状に複数繋ぐ場合は１つだけをobnizにつなぎ、残りはこのように接続して下さい。
<画像>

```Javascript
// Javascript Example
const matrix = obniz.wired("7SegmentLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
```

## init(numberOfDisplay, digits)

7セグメントLEDを初期化します。
numberOfDisplayにディスプレイの個数(=MAX7219の個数)、
digitsにディスプレイ一つあたりの7セグメントLEDの桁数を指定します。
4桁表示のディスプレイを1つ繋いだ場合はinit(1,4)となります。

```Javascript
// Javascript Example
const segment = obniz.wired("7SegmentLED_MAX7219",  { clk:0, cs:1, din:2, gnd:3, vcc:4});
segment.init(1, 4);
```

## brightness(display,value)
特定のディスプレイの明るさを変更します。
displayでディスプレイ番号を指定し(0から始まります)、
valueに0~15の範囲で明るさを指定します。

## brightnessAll(value)
接続されているすべてのディスプレイの明るさを変更します。
valueに0~15の範囲で明るさを指定します。

## setNumber(number,dp,display,digit)
7セグメントLEDを任意の数字に点灯します。
display : 表示するディスプレイ番号を指定(0から始まります)
digit : 表示する桁を指定します。(0から始まります)
number :
表示する数字を0~9で指定します。
次の文字も指定できます:-(ハイフン),E,H,L,P
消灯はoffを指定します。
dp : ドット表示がある7セグメントLEDのドットの点灯/消灯を指定します。(点灯:true,消灯:false)

ディスプレイ0の1桁目に5を表示,ドット消灯
setNumber(5,false,0,0);
ディスプレイ0の2桁目にEを表示,ドット消灯
setNumber("e",false,0,1);
ディスプレイ0の3桁目を消灯,ドットは点灯
setNumber("off",true,0,3);

//---------------編集中------------------------

```Javascript
// Javascript Example
const matrix = obniz.wired("7SegmentLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*2, 8);
matrix.brightness(7);
```

## draw(ctx)
HTML5のcanvasをそのまま描画します。html上でobnizを使っている場合は

```obniz.util.createCanvasContext()```

を使うことで、canvasを簡単に生成できます。nodejsの場合はnode-canvasを使うことが出来ます。
あとは、そこに描画し、この関数に渡すと２値化されてディスプレイに表示されます。

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
すべてを消去します。

```Javascript
// Javascript Example
const matrix = obniz.wired("7SegmentLED_MAX7219",  { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*4, 8);
matrix.clear();
```

## test()
MAX7219にあるテストコマンドを利用します。
最後に表示されていたものが表示されます。

```Javascript
// Javascript Example
const matrix = obniz.wired("7SegmentLED_MAX7219", { clk:0, cs:1, din:2, gnd:3, vcc:4});
matrix.init(8*4, 8);
matrix.test();
```
