# LED
LEDは電流を流すことで光る半導体です。電球よりもずっと少ない電流で光ります。部品にはプラスとマイナスの端子があります。逆だと電流が流れず光りません。プラスの端子は「アノード」マイナスの端子は「カソード」と言われています。プラスの端子のほうが足が長くなっています(これは他の電子部品でも同じです)

![](./image.jpg)

## obniz.wired("LED", {anode, cathode})
２本の足をObnizのピンにそれぞれ繋ぎます。LEDのプラス（足の長い方。アノードといいます）をObnizの0ピンに。マイナスをObnizの1ピンに繋いだ場合、プログラムでは以下のように設定します。

直接つないでよいのは抵抗入りLEDのみとなります。それ以外の場合は抵抗が必要です。

![](./wired.png)


```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1}); // io0 is connected to anode, io1 is cathode
led.on();
```

もしLEDのプラスだけをObnizにつなぎ、マイナスはどこかのマイナスにつながっている場合は１ピンだけの指定でOKです

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0}); // io0 is anode. cathode is connected obniz GND other way.
led.on();
```
## on()
LEDを点灯させます。

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.on();
```

![](./led_on.jpg)

## off()
LEDを消灯させます

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.off();
```

## output(value)
valueに従ってledをon,offします

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.output(true);
```

## blink(interval_ms)
LEDを点滅させます。interval_msで指定した場合はその時間で点滅します。

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.blink(); // 100msec
```
## endBlink()
LEDの点滅をやめます。LEDは最後の状態で止まります。

```Javascript
// Javascript Example
var led = obniz.wired("LED", {anode:0, cathode:1});
led.blink();
led.endBlink();
```