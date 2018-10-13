# MemoryDisplay
Adafruitのメモリディスプレイモジュールです。
[Adafruit SHARP Memory Display Breakout - 1.3" 168x144](https://www.adafruit.com/product/3502)
[Adafruit SHARP Memory Display Breakout - 1.3" 96x96](https://www.adafruit.com/product/1393)
シャープのメモリ液晶(LS013B4DN04など)を搭載したモジュールで使用することができます。

## wired(obniz,  {[vcc, gnd, sclk, mosi, cs, width, height]} )
obnizに液晶モジュールをつなぎます。
液晶ユニットは3.3V駆動です。vinは5V出力になりますので、Adafruit社製以外のモジュールを使用する場合は注意してください。
液晶との通信にSPIを使用しています。使用していないSPIが1つ以上必要です。
widthに液晶の横ドット数、heightに縦ドット数を指定します。
```javascript
// 144x168ピクセルの液晶モジュールを接続
mdisp = obniz.wired("MemoryDisplay", {vcc:0 , gnd:2 , sclk:3 , mosi:4, cs:5, width:144, height:168});
```
#描画関数
描画関数はDisplayと共通です。(qr関数を除く。)
詳しくは[Displayのページ](https://obniz.io/doc/sdk/doc/display)をご覧ください。

# Canvas contextを使って画像を表示するサンプル
"Image address here"の部分を画像のアドレスに変えると、二値化された画像がディスプレイに表示されます。
```javascript
mdisp = obniz.wired("MemoryDisplay", {vcc:0 , gnd:2 , sclk:3 , mosi:4, cs:5, width:144, height:168});
mdisp.clear();

var canvas = document.getElementById('canvas1');
if ( ! canvas || ! canvas.getContext ) { return false; }
var ctx = canvas.getContext('2d');
var img = new Image();
img.src = "Image address here";
img.onload = function() {
  ctx.drawImage(img,0,0);
  mdisp.draw(ctx);
}
```
