# Display
ObnizにあるOLEDディスプレイに文字を出したり絵を出したり出来ます。

## display.clear();

画面に表示されているものをすべてクリアします。

```Javascript
// Example
obniz.display.clear();
```
## display.print(string);

文字を表示します。半角英数字にのみ対応しています。

```Javascript
// Example
obniz.display.print("Hello!");
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
// Example
obniz.display.qr("https://obniz.io")
```

## display.raw([0,1,2,,,,]);

1ビットが1ドットです。 1=white, 0=black.
1バイトはある行の一部分を示します。
順番はこのようになります。  
{0byte} {1byte} {2byte}  
{3byte} {4byte} {5byte}...  

```javascript
obniz.display.raw([255, 255,,,,,])// msut be 128*64 bytes
```