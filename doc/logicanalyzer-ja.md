# LogicAnalyzer
ピンの状態を監視し、一定間隔で1,0の状態を取得します。
信号が送られているかの確認などに利用できます。
データ量の制限から、ピンの状態が変化してからある時間だけのデータを取得します。

## logicAnalyzer.start(io, interval, duration);

ioでのロジックアナライザーをスタートさせます。
モニター間隔と全体の時間を指定できます。
ピンに状態の変化がない場合。もしくは、変化があっても検出できないぐらい短かった場合は何もデータを受け取ることが出来ません。
変化が見つかってから決められた間隔・決められた時間分のデータを受け取れます。
データの受け取り方はonmeasured callbackを設定するか、もしくはmeasured変数から読み出す方法があります。
例えば変化があってから2msごとに1秒分のピンの1,0を取得したい場合は以下のように設定します。

```Javascript
// Example
obniz.logicAnalyzer.start(0, 2, 1000);  // start on io0. 2msec interval and 1sec long.
obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```
## logicAnalyzer.start(io, interval, duration, trigerValue, trigerValueSamples);
trigerを指定することができます。 これなしでは、全てのioの状態変化をトリガーとして動き始めます。 トリガーにより測定を開始したい値とその数を指定できます。 例えば、下の例であればfalseが3回続いたデータのみ計測します。
```Javascript
// Example
obniz.logicAnalyzer.start(0, 2, 1000, false, 3);  // start on io0. 2msec interval and 1sec long.
obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```

## logicAnalyzer.onmeasured

実際にデータを受け取るためのcallbackです。
データはioのピン状態の配列になっています。
1bitがある瞬間のioの0,1を表しています。
例えば1msec intervalの場合で
[0x01, 0x00]
といったデータを受け取った場合、
最初の瞬間だけioが1でそれ以降の15bit分は0だったことがわかります。
つまり、2msecだけioは1で、それ以降の30msecはioは0だったと推定されます。

```Javascript
// Example
obniz.logicAnalyzer.start(0, 2, 1000);  // start on io0. 1msec interval and 1sec long.

obniz.logicAnalyzer.onmeasured = function(array) {
  console.log(array);
}
```
## logicAnalyzer.end()

ロジックアナライザーを停止します。

```Javascript
// Example
obniz.logicAnalyzer.start(0, 2, 1000);  // start on io0. 1msec interval and 1sec long.
obniz.logicAnalyzer.end();
```