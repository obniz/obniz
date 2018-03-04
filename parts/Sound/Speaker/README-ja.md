# Speaker

ピエゾなどのスピーカーです。２本の線で接続し、電流によって音を出します。

## wired(obniz , {signal. gnd} )
スピーカーに接続します。プラスとマイナスがある場合はマイナスをgndの方に指定して下さい。
```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
```
## play(frequency)
スピーカーから指定した周波数の音を鳴らします
```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
speaker.play(1000); //1000hz
```

## stop()
再生を停止します。
```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
speaker.play(1000); //1000hz
obniz.freeze(1000);
speaker.stop();
```