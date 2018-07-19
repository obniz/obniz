# ServoMotor
RCサーボモーターはコンピューターの入っているギヤードモーターです。
角度を維持することができます。
ただ角度をモーターに指示するだけで良いのです。

![](./servomotor.gif)

### 電源もobnizに繋げられるモーターについて

RCサーボの多くは電源も含めそのままobnizに接続できますが、いくつかの(特に小型の）サーボモーターでは電源の電流がリークしやすくobnizの過電流検知により電源を供給できない場合があります。

その場合は以下のような対策が必要となります。

- （推奨）電源のみ外部から供給する(obnizのJ1ピンはUSB直結なのでそこから供給することもできます)
- ブレッドボードを介してobnizと接続する(ブレッドボードは抵抗が大きく、過電流検知を回避できることがあります。)


## obniz.wired("ServoMotor", {signal [, vcc, gnd]})
３本の足をObnizにつなぎます。それぞれプラス、信号、マイナスとなっていて、製造メーカーなどにより配置が違います。

この例はもっともよく使われている配線パターンです。
obnizのセットに入っているサーボモーターもこのパターンです。

![](./servocable.jpg)

信号(signal)、プラス(vcc)、マイナス(gnd)をそれぞれ obnizの0, 1, 2につないだ場合は以下のようにします。

![](./wired.png)
```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {signal:0,vcc:1, gnd:2});
servo.angle(90.0); // half position
```

vccとgndを他の方法で接続している場合はsignalのみの指定でOKです
```Javascript
var servo = obniz.wired("ServoMotor", {signal:2});
```

## angle(degree)
角度を0~180により指定します。

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {signal:0,vcc:1, gnd:2});

servo.angle(90.0); // half position
```
## on();
サーボモーターの電源を入れます。wiredを呼んだ段階で電源は入っています。offにした後に再度onにしたい時に呼んでください

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {signal:0,vcc:1, gnd:2});

servo.angle(90.0); // half position
servo.off();
servo.on();
```
## off();
サーボモーターの電源を切ります。信号の供給も停止します。保持力がなくなりますから、モーターに負荷がかかっている場合はoffにすることで勝手に回転します。

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {signal:0,vcc:1, gnd:2});

servo.angle(90.0); // half position
servo.off();
servo.on();
```