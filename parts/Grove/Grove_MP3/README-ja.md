# Grove_MP3
GroveのMP3プレーヤーです。
SDカードに保存したMP3を再生することができます。
Grove MP3 v2.0 に対応したライブラリです。

![](./image.jpg)

<iframe width="560" height="315" src="https://www.youtube.com/embed/cCRMpeUk9HM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## ファイルのルール
MP3ファイル形式やフォルダ名などは規則があります。
ルール外の場合はうまく再生されない場合がありますので注意してください。

SDカード

- 容量:8GB以下
- ファイルシステム:FAT16,FAT32

MP3ファイル

- サンプリングレート:8 / 11.025 / 12 / 16 / 22.05 / 24 / 32 / 44.1 / 48 (KHz)

フォルダ名、ファイル名
フォルダはSDカードのルートディレクトリに作成します。

1. 「MP3」フォルダを使用する場合

- フォルダ名:MP3
- ファイル名:0001から始まる4桁の数字。(0000ではない点に注意してください)

数字の後に英数字などを追加しても大丈夫です。
例:0001abc.mp3, 0002_def.mp3, 0003.mp3 ...
ファイルはおよそ3000個までです。

2. フォルダ番号を使用する場合

フォルダ名:01から始まる2桁の数字
例:/01, /02, /03 ...

- フォルダは最大99フォルダ(01~99)までです。
- ファイル名:001から始まる3桁の数字。数字の後に英数字を追加しても大丈夫です。

一つのフォルダ内のファイルは255個(01~255)までです。
例: /01/001abc.mp3, /02/001cdf.mp3

## wired(obniz, {vcc, gnd, mp3_rx, mp3_tx})
モジュールと接続します。
Groveケーブルの場合以下のようになります。

- gnd=黒
- vcc=赤
- mp3_rx=白
- mp3_tx=黄色

![](./wire.jpg)

```Javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
// Groveケーブルの場合はobniz BoardのIO_0に黒,IO_1に赤,IO_2に白,IO_3に黄色を接続してください。
```

## [await] initWait()
モジュールを初期化します。
初期化には1秒程度かかります。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
```

## setVolume(vol)
指定した音量に変更します。音量の範囲は0~31です。(0はミュート)
デフォルトでは最大音量に設定されているので注意してください。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.setVolume(10);
```

## volUp()
音量を1上げます。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.volUp();
```

## volDown()
音量を1下げます。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.volDown();
```

## play(track,folder)
指定したファイルを再生します。
trackでファイル番号、folderでフォルダ番号を指定します。
folderにフォルダを指定しない場合はMP3フォルダ内のファイルを再生します。
ファイルおよびフォルダ番号は、ファイルと同様の桁数にする必要はありません。
例: /01/0002.mp3 -> play(2,1);
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.setVolume(10);
mp3.play(1); // MP3フォルダ内の0001.mp3を再生 (/MP3/0001.mp3)
// mp3.play(1,5) // 05フォルダ内の001.mp3を再生 (/05/001.mp3)
```

## stop()
再生しているファイルを停止します。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.setVolume(10);
mp3.play(1);
await obniz.wait(5000);
mp3.stop();
```

## pause()
再生しているファイルを一時停止します。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.setVolume(10);
mp3.play(1);
await obniz.wait(5000);
mp3.pause();
```

## resume()
一時停止したファイルの再生を再開します。
```javascript
// Javascript Example
var mp3 = obniz.wired("Grove_MP3", {gnd:0, vcc:1, mp3_rx:2, mp3_tx:3});
await mp3.initWait();
mp3.setVolume(10);
mp3.play(1);
await obniz.wait(5000);
mp3.pause();
await obniz.wait(3000);
mp3.resume();
```
