# Peripherals IO
General purpose IO
io0からio11まで利用できます。

#### 特徴
##### input/output
それぞれのioで入力/出力ができます。入力では値の変更時のみ通知が来ます。
##### ３つの出力方法
###### push-pull5v (デフォルト)
1. 最大1A
2. 過電流/ドライバーの高温 保護
3. io.output()使用時の過電流警告
4. 最大250kHz(推奨値)

###### push-pull3v
1. 最大1mA
2. io.output()使用時の過電流自動停止と警告
3. 最大80Mhz

###### open-drain
1. 最大1mA
2. 最大80Mhz

##### Four internal weak pull-updown option
1. floating (デフォルト)
1. pull-up 5v
1. pull-up 3v
1. pull-down to gnd

driveとpull-updownはそれぞれのペリフェラル(PWMやUART)使用時にも利用できます。

## output(value)
ObnizのX番ピンを出力ピンにして１または０を出力します。

```Javascript
// Javascript Example
obniz.io1.output(true); // io1 is 5V
```
## drive(type)
出力するときのドライブ方法を変更します。
デフォルトでは"5v"となっていて、モータードライバを使った5vのプッシュプルで、最大電流が1Aのモードとなっています。

1. "5v"
  - push-pull 5v モード. 最大1A
2. "3v"
  - push-pull 3v モード. 最大約 1mA. 電圧は電流を流すほど低下していきます。
3. "open-drain"
  - open-drain モード. 電圧と電流についてはpush-pull3vと同じです。

が利用可能です。

```Javascript
// Javascript Example
obniz.io1.output(true); // output push-pull 5v
obniz.io1.pull("5v");
obniz.io1.drive("open-drain"); // changed immediately 
```

## pull(pulltype)
IOの内部プルアップ・プルダウンを変更します。

1. null (default) 
2. "5v"  5vに内部プルアップします。
3. "3v"  3vに内部プルアップします。
4. "0v"  gndにプルダウンします。

```Javascript
// Javascript Example
obniz.io0.pull(null);
obniz.io1.pull("3v");
obniz.io1.drive("open-drain"); // output open-drain
```

## input(callback)
ピンに加わっている電圧を読みtrue/falseを読み取ります。
true/falseの値が変わるたびにcallbackを呼び出します。
```Javascript
// Javascript Example
obniz.io0.input(function(value){
  console.log("changed to " + value);
});
```
## [await] inputWait
ピンに加わっている電圧を読み結果をture/falseで返します。
この関数を呼ぶことでピンをinputに設定し、値が返ってくるまで関数はwaitします。
```Javascript
// Javascript Example
var value = await obniz.io0.inputWait();
console.log(value);
```

## io.animation(name, status, array of animations)
io animationは高速にioを変化させたいたい時に使います。
"loop"アニメーションが利用できます。
jsonのarrayに従い順番にioを繰り返し変更します。
ioとpwmコマンドのみ利用できます。
durationはその状態がどれだけ続くかで、1~429426ミリ秒(約1時間)が指定できます。
stateにセットする関数の中でioの状態を指定してください。

```Javascript
// Javascript Example
obniz.io.animation("animation-1", "loop", [
  {
    duration: 10,
    state: function(index){ // index = 0
      obniz.io0.output(false)
      obniz.io1.output(true)
    }
  },{
    duration: 10,
    state: function(index){ // index = 1
      obniz.io0.output(true)
      obniz.io1.output(false)
    }
  }
])
```

実行するとこのような波形になります。

![](./images/ioanimation.png)

io animationの削除
```Javascript
// Example
obniz.io.animation("animation-1", "loop")
```

io animationの一時停止
```Javascript
// Example
obniz.io.animation("animation-1", "pause")
```

io aniomationの再開
```Javascript
// Example
obniz.io.animation("animation-1", "resume")
```