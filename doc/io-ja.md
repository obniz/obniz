# Peripherals IO
General purpose IO
io0からio11まで利用できます。

#### 特徴
##### output
それぞれのioでデジタル出力が可能です。

出力のドライブ方法は下の３つから選べます。

タイプ | 電圧 | 最大電流 | 最大周波数 | 詳細
:---: | :---: | :---: | :---: | ---
push-pull | `5v` | <=1A | <=250khz(推奨) | 標準。過電流/ドライバ高温保護付き
push-pull | `3v` | <=1mA(推奨) | <=80Mhz | io.output()使用時の過電流自動停止と警告
open-drain | `<=5v` | <=1mA(推奨) | <=80Mhz | 

上記出力方法はIOごとに設定できます。
また、io.output()のだけでなく、UARTやSPIなどの出力時にも好きなドライブ方法を選択できます。

##### input

デジタル入力タイプは１つのみとなります。
5V入力が可能な3v入力となっています。つまり、しきい値はCMOSレベルです。


タイプ | レベル | 最大周波数 | 詳細
:---: | :---: | :---: | :---:
digital-in | `3v(5vトレラント)` | <=80Mhz |  

##### internal weak pull-up/pull-dow

プルアップ・ダウンは各IOごとに設定でき、以下の４タイプから選べます。
また、

タイプ | プル先 | 詳細
:---: | :---: | :---:
floating | &nbsp; | 標準設定
pull-up | `5v` | 
pull-up | `3v` | 
pull-down | `gnd` | 

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
obniz.io0.output(true); // output push-pull 5v

obniz.io1.drive("3v");
obniz.io1.output(true); // output push-pull 3v

obniz.io2.pull("5v");
obniz.io2.drive("open-drain");
obniz.io2.output(true); // output open-drain with 5v pull-up
```

## pull(pullType)
IOの内部プルアップ・プルダウンを変更します。

1. null (default) 
2. "5v"  5vに内部プルアップします。
3. "3v"  3vに内部プルアップします。
4. "0v"  gndにプルダウンします。

```Javascript
// Javascript Example
obniz.io0.pull("3v");
obniz.io0.drive("open-drain"); // output open-drain
obniz.io0.output(false);
```

## input(callback)
ピンに加わっている電圧を読みtrue/falseを読み取ります。
信号レベルは5vトレラントの3v入力です。
出力タイプはinputには関係ないためdrive()の指定とは関係ありません。

true/falseの値が変わるたびにcallbackを呼び出します。
```Javascript
// Javascript Example
obniz.io0.input(function(value){
  console.log("changed to " + value);
});
```

## [await] inputWait
ピンに加わっている電圧を読み結果をtrue/falseで返します。
この関数を呼ぶことでピンをinputに設定し、値が返ってくるまで関数はwaitします。
```Javascript
// Javascript Example
var value = await obniz.io0.inputWait();
console.log(value);
```

## end()
ioXにおけるoutputとinputを停止します。
output()かinput()を使っているときのみ効果があります。
ADやUARTをioXで使っている場合はこれでは停止しません。
また、pull-up downも影響を受けません。

```Javascript
// Javascript Example
obniz.io0.output(true)
obniz.io0.end();
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

io animationの再開
```Javascript
// Example
obniz.io.animation("animation-1", "resume")
```