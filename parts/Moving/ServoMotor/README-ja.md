# ServoMotor
RCサーボモーターはコンピューターの入っているギヤードモーターです。
角度を維持することができます。
ただ角度をモーターに指示するだけで良いのです。

![](./image.jpg)

![](./servomotor.gif)

### 電源もobniz Boardに繋げられるモーターについて

RCサーボの多くは電源も含めそのままobniz Boardに接続できますが、いくつかの(特に小型の）サーボモーターでは電源の電流がリークしやすくobniz Boardの過電流検知により電源を供給できない場合があります。

その場合は以下のような対策が必要となります。

- （推奨）電源のみ外部から供給する(obniz BoardのJ1ピンはUSB直結なのでそこから供給することもできます)
- ブレッドボードを介してobniz Boardと接続する(ブレッドボードは抵抗が大きく、過電流検知を回避できることがあります。)

obniz Boardのioから直接電源供給を確認したサーボモーター

メーカー | 型番
--- | ---
Tower Pro | SG-5010
Tower Pro | MG92B
Tower Pro | MG90S
Tower Pro | MG90D
Tower Pro | SG90
Tower Pro | SG92R
GWS | S35STD

obniz Boardのioからでは直接電源供給できないサーボモーター

メーカー | 型番
--- | ---
Quimat | QKY66-5
FEETECH | FS90R

## obniz.wired("ServoMotor", {[vcc, gnd, signal, pwm]})
３本の足をobniz Boardにつなぎます。それぞれプラス、信号、マイナスとなっていて、製造メーカーなどにより配置が違います。

この例はもっともよく使われている配線パターンです。
obniz Boardのセットに入っているサーボモーターもこのパターンです。

![](./servocable.jpg)

マイナス(gnd)、プラス(vcc)、信号(signal)をそれぞれ obniz Boardの0, 1, 2につないだ場合は以下のようにします。

![](./wired.png)
```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {gnd:0,vcc:1,signal:2});
servo.angle(90.0); // half position
```

vccとgndを他の方法で接続している場合はsignalのみの指定でOKです
```Javascript
var servo = obniz.wired("ServoMotor", {signal:2});
```

また、生成済みのpwmオブジェクトを利用することも出来ます
```Javascript
var pwm = obniz.getFreePwm();
var servo = obniz.wired("ServoMotor", {pwm:pwm});
```

## angle(degree)
角度を0~180により指定します。

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {gnd:0,vcc:1,signal:2});

servo.angle(90.0); // half position
```

## range = {min, max}

出力するパルス幅を調整できます。
0度~180度に応じて0.5~2.4msecのパルスが出力されますが、それを自分で調整したい場合に利用します。

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {gnd:0,vcc:1,signal:2});
servo.range = {
  min: 0.8,
  max: 2.4
}
servo.angle(90.0); // half position
```

## on();
サーボモーターの電源を入れます。wiredを呼んだ段階で電源は入っています。offにした後に再度onにしたい時に呼んでください

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {gnd:0,vcc:1,signal:2});

servo.angle(90.0); // half position
servo.off();
servo.on();
```
## off();
サーボモーターの電源を切ります。信号の供給も停止します。保持力がなくなりますから、モーターに負荷がかかっている場合はoffにすることで勝手に回転します。

```Javascript
// Javascript Example
var servo = obniz.wired("ServoMotor", {gnd:0,vcc:1,signal:2});

servo.angle(90.0); // half position
servo.off();
servo.on();
```