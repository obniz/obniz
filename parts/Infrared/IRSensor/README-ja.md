# IRSensor

リモコンで使われる赤外線の信号を検出します。

![](./image.jpg)


## wired(obniz, {output [vcc, gnd]})

vccとgndを接続します。(vccとgndはオプショナルです。外に繋いでいる場合は無くても大丈夫です。)
outputはセンサーのoutputにつなぎます。

一般的なフィルター付き赤外線リモコン受信回路などはそのまま接続可能です。

以下は動くことが分かっている部品です。

1. [OSRB38C9AA](http://akizukidenshi.com/download/OSRB38C9AA.pdf)
2. [TFMS5380](https://www.voti.nl/docs/tfms5360.pdf) etc,,,

部品によってピンの順番が違いますので注意して下さい。

![](./OSRB38C9AA.jpg)

![](./tfms5380.jpg)

そして、プログラム上で刺した場所を指定します。
 
```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
```

## start(callback(array))
モニターを開始ます。検出したら引数に渡した関数が呼ばれます。

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
sensor.start(function (arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
})
```

結果であるarrには `obniz.LogicAnalyzer`で得られのと同じ配列が入っています。
なので、こんなフォーマットです。

```javascript
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0]
```


いくつかの検出オプションは`start()`で開始する前に設定することが出来ます。
どれも`obniz.LogicAnalyzer`のオプションと共通ですので、詳しくはそちらをご覧ください。

設定可能なのは以下のとおりです。

property | type | default | description
--- | --- | --- | --- 
dataSymbolLength | `number` | 0.07 (msec) | LogicAnalyzerのサンプリング間隔
duration | `number` | 500 (msec) | 取得データの長さ
dataInverted | `number` | true | 取得データの0,1を反転するかどうか
cutTail | `number` | false | 信号の最後の無駄な0を除去します。除去することでうまく通信できないこともあります。
output_pullup | `number` | true | センサーの出力端子を5vで内部プルアップします。

どれも`start()`で開始する前に設定して下さい。

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
sensor.duration = 150;
sensor.dataInverted = false;
sensor.start(function (arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
})
```

## ondetect = function(array)

startした後にcallbackを設定/変更する場合はこの変数に関数を入れて下さい。

```javascript
// Javascript Example
var sensor = obniz.wired('IRSensor', {vcc:0, gnd:1, output: 2});
sensor.start()

sensor.ondetect = function(arr) {
  console.log('detected!!')
  console.log(JSON.stringify(arr));
}
```