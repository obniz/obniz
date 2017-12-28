# Speaker
ピエゾなどのスピーカーです。２本の線で接続し、電流によって音を出します。

## wired(obniz, con0, con1)
スピーカーに接続します。プラスとマイナスがある場合はマイナスをcon0の方に指定して下さい。
```
var speaker = Parts("Speaker");
speaker.wired(obniz, 0, 1);
```
## freq(frequency)
スピーカーから鳴る音の周波数を指定します。
```
var speaker = Parts("Speaker");
speaker.wired(obniz, 0, 1);
speaker.freq(1000); //1khz
```