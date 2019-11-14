# WS2812
フルカラーLEDのドライバICです。
１つのLEDだけでなく、チェーン接続にも対応しています。

![](./image.jpg)

WS2812 は多くのフルカラーLEDに組み込まれています。

## wire({din, [vcc, gnd]})

vcc,gnd,dinをobniz Boardに接続し、接続したioをプログラムで以下のように記載します。

![](./wired.png)

```Javascript
// Javascript Example
var leds = obniz.wired("WS2812", {gnd:0, vcc: 1, din: 2});
leds.rgbs([
  [0xFF, 0x00, 0x00], // red
  [0x00, 0x00, 0xFF]  // blue
])
```
vccとgndを外に繋いでいる場合は省略可能です。

```Javascript
// Javascript Example
var led = obniz.wired("WS2812", {din: 2});
```

## rgb(red, green, blue)
RGBで色を指定します。
チェーン接続している場合はトップの１つの色だけが変わります。
```Javascript
// Javascript Example
var led = obniz.wired("WS2812", {gnd:0, vcc: 1, din: 2});
led.rgb(0xFF, 255, 0); // Yellow
```

## hsv(hue, saturation, value)
HSVで色を指定します。
チェーン接続している場合はトップの１つの色だけが変わります。

1. hue : 0 ~ 360
2. saturation : 0 ~ 1
3. value : 0 ~ 1

```Javascript
// Javascript Example
var led = obniz.wired("WS2812", {gnd:0, vcc: 1, din: 2});
led.hsv(180, 0.5, 1);
```

## rgbs([[r,g,b],,,,])
チェーン接続されてるLEDの色をRGBで頭から変更します。
それぞれの色を指定することが出来ます。
チェーンの最大は85です。(SPIの最大バイト数に依存しています)
```Javascript
// Javascript Example
var led = obniz.wired("WS2812", {gnd:0, vcc: 1, din: 2});
led.rgbs([
  [0xFF, 0x00, 0x00], // red
  [0x00, 0x00, 0xFF]  // blue
])
```
## hsvs([[r,g,b],,,,])
チェーン接続されてるLEDの色をHSVで頭から変更します。
それぞれの色を指定することが出来ます。
チェーンの最大は85です。(SPIの最大バイト数に依存しています)
```Javascript
// Javascript Example
var led = obniz.wired("WS2812", {gnd:0, vcc: 1, din: 2});
led.hsvs([
  [180, 0.5, 1],
  [0, 1, 1]
])
```