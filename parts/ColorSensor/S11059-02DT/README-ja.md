# S11059
カラーセンサS11059-02DTから赤,緑,青,赤外のそれぞれの色のレベルを取得します。

=途中=

## wired(obniz,  { vcc, sda, scl, gnd});

1. vcc: 電源のプラスです。
2. sda: I2CのSDAです。S11059-02DTのSDAピンへ接続してください。
3. scl: I2CのSCLです。S11059-02DTのSCLピンへ接続してください。
4. gnd: 電源のマイナスです。

```Javascript
// Javascript Example
var colorSens = obniz.wired("S11059", {vcc:0, sda:1, scl:2, gnd:3});
```

## init(Gain, IntergerTime)
デバイスを初期化します。
Gain : センサのゲインを指定します。1でHigh(高感度)、 0でLow(低感度)になります。
IntergerTime: 積分時間を0~3で指定します。積分時間が長いほど高感度になります。具体的な時間は以下に示す通りです。
0:87.5uS, 1:1.4ms, 2:22.4ms, 3:179.2ms

```Javascript
// Javascript Example
var colorSens = obniz.wired("S11059", {vcc:0, sda:1, scl:2, gnd:3});
colorSens.init(1,2); // ゲイン高感度, 積分時間22.4msで初期化
```

## [async] getVal()
センサから値を取得します。各色の値が配列で返されます。

```Javascript
// Javascript Example
var colorSens = obniz.wired("S11059", {vcc:0, sda:1, scl:2, gnd:3});
colorSens.init(1,2);
var ret = await colorSens.getVal(); // 各色の値を取得
console.log("getVal:"+ ret); // 取得した配列を表示
var red = ret[0]; // 赤色のレベルを変数redへ代入
var green = ret[1];　// 緑色のレベルを変数greenへ代入
var blue = ret[2];　// 青色のレベルを変数blueへ代入
var ir = ret[3];　// 赤外線のレベルを変数irへ代入
// それぞれの配列を表示
console.log("Red:"+ red);
console.log("Green:"+ green);
console.log("Blue:"+ blue);
console.log("IR:"+ ir);
```
