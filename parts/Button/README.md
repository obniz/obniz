# Button
押すことで電流を流したり止めたり出来る部品です。これをつなぎ電流が流れているかを見ることでボタンが押されているかをチェックできます。このモジュールではボタンの形によらず、とにかく押せば電流が流れるボタンを扱うことができます。

```
wired(obniz, button_0, button_1)
```
ボタンにある２つのピンをObnizにつなぎます。プラスとマイナスはありません。例えば片方をObnizの0番に。もう片方を1番につないだ場合は以下のようにプログラム上でwireします


```
var button = Parts("Button");
button.wired(obniz, 0, 1);
```
## onChange(callback)
 ボタンの状態を監視し、ボタンが押された時、離された時に<br>callback関数を呼び出します。

```
var button = Parts("Button");
button.wired(obniz, 0, 1);
button.onChange(function(pressed){
  console.log("pressed:" + pressed)
});
```

## [async] isPressedWait
ボタンが押されているかを確認します。
```
var button = Parts("Button");
button.wired(obniz, 0, 1);
var pressed = await button.isPressedWait();
console.log("Pressed = " + pressed);
```