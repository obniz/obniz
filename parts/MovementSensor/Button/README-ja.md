# Button
押すことで電流を流したり止めたり出来る部品です。これをつなぎ電流が流れているかを見ることでボタンが押されているかをチェックできます。このモジュールではボタンの形によらず、とにかく押せば電流が流れるボタンを扱うことができます。

## obniz.wired("Button", {signal:0, gnd:1})

![photo of wired](./wired.png)
```Javascript
// Javascript Example
wired(obniz, {signal:0, gnd:1})
```
ボタンにある２つのピンをObnizにつなぎます。プラスとマイナスはありません。例えば片方をObnizの0番に。もう片方を1番につないだ場合は以下のようにプログラム上でwireします


```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
```

## onchange = function(pressed){}
ボタンが押された時、離された時にcallback関数を呼び出します。

```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
button.onchange = function(pressed){
  console.log("pressed:" + pressed)
};
```

## [async] isPressedWait
ボタンが押されているかを確認します。
```Javascript
// Javascript Example
var button = obniz.wired("Button",  {signal:0, gnd:1});
var pressed = await button.isPressedWait();
console.log("Pressed = " + pressed);
```