# LED
LEDは電流を流すことで光る半導体です。電球よりもずっと少ない電流で光ります。部品にはプラスとマイナスの端子があります。逆だと電流が流れず光りません。プラスの端子は「アノード」マイナスの端子は「カソード」と言われています。プラスの端子のほうが足が長くなっています(これは他の電子部品でも同じです)

## 接続方法
２本の足をObnizのピンにそれぞれ繋ぎます。LEDのプラス（足の長い方。アノードといいます）をObnizの1ピンに。マイナスをObnizの2ピンに繋いだ場合、プログラムでは以下のように設定します

```Javascript
var led = obniz.wired("LED", 1, 2);
```
もしLEDのプラスだけをObnizにつなぎ、マイナスはどこかのマイナスにつながっている場合は１ピンだけの指定でOKです

```Javascript
var led = obniz.wired("LED", 1, 2); // 1 is LED's anode
```
## on()
LEDを点灯させます。

### Example
```Javascript
var led = obniz.wired("LED", 1, 2);

led.on();
```
## off()
LEDを消灯させます

```Javascript
var led = obniz.wired("LED", 1, 2);

led.off();
```
## blink(interval_ms)
LEDを点滅させます。interval_msで指定した場合はその時間で点滅します。
```Javascript
var led = obniz.wired("LED", 1, 2);

led.blink();
```
## endBlink()
LEDの点滅をやめます。LEDは最後の状態で止まります。
```Javascript
var led = obniz.wired("LED", 1, 2);

led.blink();
led.endBllink();
```