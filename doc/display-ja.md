# Display (obniz.display)
ObnizにあるOLEDディスプレイに文字や絵を描画します。

![](./images/obniz_display_sphere.gif)

## clear();

画面に表示されているものをすべてクリアします。

```Javascript
// Javascript Example
obniz.display.clear();
```
## print(string);

文字を表示します。半角英数字にのみ対応しています。

```Javascript
// Javascript Example
obniz.display.print("Hello!");
```

ブラウザはUTF8 の文字も描画可能です. (node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
```javascript
// Javascript Example
obniz.display.font('Serif',18)
obniz.display.print("Hello World🧡")
```
![](./images/obniz_display_print.jpg)

## pos(x, y);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
文字の描画位置を変更します。次にprint()でも字を出すときはこの位置を左上として文字を描画します。
```javascript
// Javascript Example
obniz.display.pos(0,30);
obniz.display.print("YES. こんにちは");
```
![](./images/obniz_display_pos.jpg)

## font(fontFamilyName, fontSize);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
フォントを変更します。
利用できるフォントはプログラムを動かしているブラウザに依存します。

デフォルトのフォントはArial 16pxです．
nullを指定することで，デフォルトのフォントを使用します.
```javascript
// Javascript Example
obniz.display.font('Avenir',30)
obniz.display.print("Avenir")

obniz.display.font(null,30) //デフォルトフォント(Arial)の30px
obniz.display.font('Avenir') //Avenirのデフォルトサイズ(16px)
```
![](./images/obniz_display_samples3.jpg)
![](./images/obniz_display_samples2.jpg)
![](./images/obniz_display_samples4.jpg)

## line(start_x, start_y, end_x, end_y);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
２点間の線を描画します。
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
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
矩形を描画します。
```javascript
// Javascript Example
obniz.display.rect(10, 10, 20, 20);
obniz.display.rect(20, 20, 20, 20, true); // filled rect
```

## circle(x, y, radius, fill);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
円を描画します
```javascript
// Javascript Example
obniz.display.circle(40, 30, 20);
obniz.display.circle(90, 30, 20, true); // filled circle
```

## drawing(mode)

これ以降の描画を転送するかどうかを指定できます。canvasを利用する`clear/print/line/rect/circle/draw`のみが影響を受けます。

このディスプレイクラスではprintやlineなど、画面が少しでも変われば画面全体を
obnizに転送して、obnizのディスプレイを更新します。
その場合、描画が多い場合は転送に時間がかかってしまいます。
ある程度描画してから最後に一気にobnizに転送するための機能がdrawing()です。
`drawing(false)`で転送を停止でき、`drawing(true)`で転送を再開できます。再開時には変更があってもなくても一度転送されます。

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

QRコードを表示します。dataは現在文字列にのみ対応しています。
correctionはエラー訂正レベルで

1. L
2. M(default)
3. Q
4. H

から選べます。Hにすると強いエラー訂正が入ります。

```Javascript
// Javascript Example
obniz.display.qr("https://obniz.io")
```

## raw([0,1,2,,,,]);

1ビットが1ドットです。 1=white, 0=black.
1バイトはある行の一部分を示します。
順番はこのようになります。  
{1byte} {2byte} {3byte}...{16byte}  
{17byte} {18byte} {19byte}...  
.....  
.....................{1024byte}  

```javascript
obniz.display.raw([255, 255,,,,,])// must be 128*64 bits(=1024byte)
```

## draw(context)
HTML5のCanvas contextをもとに描画します。
node-canvasを利用すればnode.jsでも利用可能です。

```javascript

// 1. load existing
const ctx = $("#canvas")[0].getContext('2d');
// 2. create new canvas dom and load it.
const ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);

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

UTF8 Text

![](./images/obniz_display_samples0.jpg)

Tilt Text

![](./images/obniz_display_samples1.jpg)
