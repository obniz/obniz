# Peripherals IO
General purpose IO
io0からio11まで利用できます。

## output(value)
ObnizのX番ピンを出力ピンにして１または０を出力します。

```Javascript
// Example
obniz.io1.output(true); // io1 is 5V
```
## outputType(type)
出力するときのドライブ方法を変更します。
デフォルトではpush-pullとなっています。

1. push-pull
2. push-pull3v
3. open-drain

が利用可能です。
既にoff()やon()などで出力しているときはpush-pull3vとopen-drainタイプの切り替えは即座に行われますが。push-pullへの切り替えやpush-pullから他のものへの切り替えは出力中は切り替えられません。
inputにしてから次にoutputとして利用する時に適用されます。
```Javascript
// Example
obniz.io1.output(true); // output push-pull
obniz.io1.pullup();
obniz.io1.outputType("open-drain"); // changed immediately 
```

## pullup5v()
IOピンを5vで内部プルアップします。
入力、もしくはオープンドレイン出力の時に利用されます。
デフォルトではfloat(pull-up pull-downなし)となっていて、下の状態のうちどれかとなります。

1. float
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.pullup5v();
obniz.io1.outputType("open-drain"); // output open-drain
```

## pullup()
IOピンを内部プルアップします。
入力、もしくは3.3V出力の時に利用されます。
デフォルトではfloat(pull-up pull-downなし)となっていて、下の4状態のうちどれかとなります。

1. float
2. pullup
3. pullup5v
4. pulldown

オープンドレインの時にはpullupをすることが多いかと思います。
```Javascript
// Example
obniz.io1.pullup();
obniz.io1.outputType("open-drain"); // output open-drain
```
## pulldown()
IOピンを内部プルダウンします。
入力、もしくは3.3V出力の時に利用されます。
デフォルトではfloat(pull-up pull-downなし)となっていて、下の4状態のうちどれかとなります。

1. float
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.pulldown();
obniz.io1.get();
```

## float()
IOピンの内部プルアップを解除します。これがデフォルトです。
入力、もしくは3.3V出力の時に利用されます。
デフォルトではfloat(pull-up pull-downなし)となっていて、下の4状態のうちどれかとなります。

1. float
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.float();
var val = await obniz.io1.inputWait();
```

## input(callback)
ピンに加わっている電圧を読みtrue/falseを読み取ります。
true/falseの値が変わるたびにcallbackを呼び出します。
```Javascript
// Example
obniz.io0.input(function(value){
  console.log("changed to " + value);
});
```
## [await] inputWait
ピンに加わっている電圧を読み結果をture/falseで返します。
この関数を呼ぶことでピンをinputに設定し、値が返ってくるまで関数はwaitします。
```Javascript
// Example
var value = await obniz.io0.inputWait();
console.log(value);
```