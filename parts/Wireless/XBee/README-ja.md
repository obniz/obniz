# XBee
複数のXBeeを使って通信します．ブロードキャストや１対１の通信ができます

![](./image.jpg)

## obniz.wired

XBeeをtx,rxのピンを指定して接続します．
XBeeはVCCとGNDが必要なので，それは別で用意する必要があります．

![](./wired.png)

```javascript
// Javascript Example
obniz.io11.output(true);
obniz.io8.output(false);
var xbee = obniz.wired("XBee", {tx:9,rx:10});
```


## await configWait(json)

XBeeを設定します．設定に３秒程度かかるため，"await" をつけて使用して下さい．
```javascript
// Javascript Example
obniz.io11.output(true);
obniz.io8.output(false);
var xbee = obniz.wired("XBee", {tx:9,rx:10});
await xbee.configWait({
   	"destination_address" : "52",
   	"source_address" : "51",
});
```

設定Jsonの書き方は下のようになります

```javascript
{
  "destination_address" : "5A",     // 送信先アドレスの16進数の文字列   ( 0 ~ FFFFFFFFFFFFFFFF)
                                    // 0x000000000000FFFF を設定するとブロードキャストになります
  "source_address" : "E2",          // 自分のアドレスの16進数の文字列  ( 0 ~ FFFFFFFF)

  // or 

  "destination_address_high" : "0",  // 上位 16 ビットの設定 ( 0 ~ FFFFFFFF)
  "destination_address_low" : "5A",  // 下位 16 ビットの設定 ( 0 ~ FFFFFFFF)

  // or 

  "DH" : "0",                //AT コマンドを直接書くこともできます.
  "DL" : "5A",               //ATコマンドについてはメーカーのドキュメントを参照してください
  "MY" : "E2",
  
}
```

## send(data)
データを送信します。
dataで送れるものは

- 文字
- 数字 => 1byteのデータになります
- 数字の配列 => １つ１つ1byteのデータとして送信されます
- オブジェクト => 文字になります
- Buffer => そのまま送信されます

もし設定が完了していない段階で呼ばれた場合，エラーになります.

```javascript
// Javascript Example
obniz.io11.output(true);
obniz.io8.output(false);
var xbee = obniz.wired("XBee", {tx:9,rx:10});
xbee.send("Hi");
xbee.send(0x11);
xbee.send([0x11, 0x45, 0x44]);
xbee.send({success: true});
```

## onreceive(data, text)

データを受信した時に呼び出されます。
第一引数のdataは受信したデータをarrayとして受け取れます。
第二引数のtextは受信したarrayをtextとして変換したものです。

```javascript
// Javascript Example
obniz.io11.output(true);
obniz.io8.output(false);
var xbee = obniz.wired("XBee", {tx:9,rx:10});
xbee.onreceive = function(data, text) {
    console.log("recieved : " + text);
}
```