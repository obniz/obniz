# Display
ObnizにあるOLEDディスプレイに文字や絵を描画します。

![](./images/obniz_display_sphere.gif)

## display.clear();

画面に表示されているものをすべてクリアします。

```Javascript
// Javascript Example
obniz.display.clear();
```
## display.print(string);

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

## display.pos(x, y);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
文字の描画位置を変更します。次にprint()でも字を出すときはこの位置を左上として文字を描画します。
```javascript
// Javascript Example
obniz.display.pos(0,30);
obniz.display.print("YES. こんにちは");
```
![](./images/obniz_display_pos.jpg)

## display.font(fontFamilyName, fontSize);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
フォントを変更します。
利用できるフォントはプログラムを動かしているブラウザに依存します。
```javascript
// Javascript Example
obniz.display.font('Avenir',30)
obniz.display.print("Avenir")
```
![](./images/obniz_display_samples3.jpg)
![](./images/obniz_display_samples2.jpg)
![](./images/obniz_display_samples4.jpg)

## display.line(start_x, start_y, end_x, end_y);
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

## display.rect(x, y, width, height, fill);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
矩形を描画します。
```javascript
// Javascript Example
obniz.display.rect(10, 10, 20, 20);
obniz.display.rect(20, 20, 20, 20, true); // filled rect
```

## display.circle(x, y, radius, fill);
(node.jsでは使えません 代わりにdisplay.draw()を使って下さい)
 
円を描画します
```javascript
// Javascript Example
obniz.display.circle(40, 30, 20);
obniz.display.circle(90, 30, 20, true); // filled circle
```


## display.qr(data, correction)

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

## display.raw([0,1,2,,,,]);

1ビットが1ドットです。 1=white, 0=black.
1バイトはある行の一部分を示します。
順番はこのようになります。  
{1byte} {2byte} {3byte}...{16byte}  
{17byte} {18byte} {19byte}...  
.....  
.....................{1024byte}  

```javascript
obniz.display.raw([255, 255,,,,,])// msut be 128*64 bits(=1024byte)
```

## display.draw(context)
HTML5のCanvas contextをもとに描画します。
node-canvasを利用すればnode.jsでも利用可能です。

```javascript

// 1. load existing
const ctx = $("#canvas")[0].getContext('2d');
// 2. create new canvas dom and load it.
const ctx = obniz.util.createCanvasContext(obniz.display.width, obniz.display.height);

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

UTF8 Text

![](./images/obniz_display_samples0.jpg)

Tilt Text

![](./images/obniz_display_samples1.jpg)
