# Speaker

ピエゾなどのスピーカーです。２本の線で接続し、電流によって音を出します。

## wired(obniz , {signal. gnd} )
スピーカーに接続します。プラスとマイナスがある場合はマイナスをgndの方に指定して下さい。
```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
```
## freq(frequency)
スピーカーから鳴る音の周波数を指定します。
```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
speaker.freq(1000); //1khz
```