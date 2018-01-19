# JoyStick
X軸Y軸とプッシュスイッチをもつジョイスティックです。出力がアナログ値の一般的なものに対して利用できます。

## wired(obniz, sw, y, x, vdd, gnd)
obnizと接続します。vddはジョイスティックの5v入力へ。gndはマイナスへ接続します。  
sw: スイッチ  
y: y軸のアナログ値出力  
x: x軸のアナログ値出力  
へ接続して下さい
```Javascript
var joystick = obniz.wired("JoyStick", 0,1,2,3,4);

```
## onChangeX(callback)
X軸方向へ動いた場合に呼ばれる関数を指定できます。
```Javascript
var joystick = obniz.wired("JoyStick", 0,1,2,3,4);
joystick.onChangeX(function(val){
  console.log(val);
})
```
## onChangeY(callback)
onChangeXと同じでY軸に関してです。
## onChangeSW(callback)
ボタンが押されたり離された時に呼ばれます。
```Javascript
var joystick = obniz.wired("JoyStick", 0,1,2,3,4);
joystick.onChangeSW(function(pressed){
  console.log(pressed);
})
```