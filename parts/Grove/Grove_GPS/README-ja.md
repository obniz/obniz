# Grove_GPS


Grove GPSモジュール[(Grove - GPS)](https://www.seeedstudio.com/Grove-GPS-p-959.html)から情報を取得するライブラリです。
機能は[こちらのモジュール](https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md)とほぼ同じですが、Grove GPSモジュールには1PPM出力がありません。

## wired(tx, rx, vcc, gnd)

obnizのtx,rx,vcc,gndをぞれぞれGPSモジュールの対応するピンに接続します。
Groveシステムなので、
| obniz | Groveケーブルの色 |
|:--:|:--:|
| tx | 黄 |
| rx | 白 |
| vcc | 赤 |
| gnd | 黒 |
となるはずです。

突入電流対策のため、obnizのvcc(5V出力)とGPSモジュールのvccの間に5~10Ω程度の抵抗を挿入してください。

```javascript
// Javascript Example
let gps = obniz.wired("Grove_GPS", { tx:5, rx:6, vcc:7, gnd:8 });
let sentence = gps.readSentence();
```

start1pps(callback)関数が使えない以外は[GYSFDMAXBモジュール](https://obniz.io/ja/sdk/parts/GYSFDMAXB/README.md)と共通です。その他関数についてはGYSFDMAXBモジュールのライブラリをご覧ください。
