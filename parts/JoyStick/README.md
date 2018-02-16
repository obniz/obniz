# JoyStick
X軸Y軸とプッシュスイッチをもつジョイスティックです。出力がアナログ値の一般的なものに対して利用できます。

## wired(obniz, {sw, x, y, vcc, gnd})
obnizと接続します。vccはジョイスティックの5v入力へ。gndはマイナスへ接続します。  
sw: スイッチ  
x: x軸のアナログ値出力  
y: y軸のアナログ値出力  
へ接続して下さい
```Javascript
var joystick = obniz.wired("JoyStick", {sw:0, x:1, y:2, vcc:3, gnd:4});

```
## onchangex(callback)
## onchangey(callback)
それぞれX軸，Y軸方向へ動いた場合に呼ばれる関数を指定できます。
```Javascript
var joystick = obniz.wired("JoyStick", {sw:0, x:1, y:2, vcc:3, gnd:4});
joystick.onchangex = function(val){
  console.log(val);
};

joystick.onchangey = function(val){
  console.log(val);
};
```

## onchangesw(callback)
ボタンが押されたり離された時に呼ばれます。
```Javascript
var joystick = obniz.wired("JoyStick", {sw:0, x:1, y:2, vcc:3, gnd:4});
joystick.onchangesw = function(pressed){
  console.log(pressed);
};
```