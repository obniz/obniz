# M5Stack_JoyStick

X軸Y軸とプッシュスイッチをもつM5Stack用ジョイスティックです。出力がアナログ値の一般的なものに対して利用できます。  
I2C通信を利用します。  

## wired(obniz, {scl, sda, vcc, gnd})
obniz Boardと接続します。  
白線、黄線、赤線、黒線がそれぞれscl、sda、vcc、gndに対応します。  

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5Stack_JoyStick", {scl:0, sda:1, vcc:2, gnd:3});
```


## [await] isPressedWait()
ボタンが押されているかどうかを一度だけ取得します。  

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5Stack_JoyStick", {scl:0, sda:1, vcc:2, gnd:3});

var isPressed = await joystick.isPressedWait();
if (isPressed) {
    console.log("Pressed!");
}
```


## [await] getXWait()
## [await] getYWait()

X、Yそれぞれの傾きを一度だけ取得します。

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5Stack_JoyStick", {scl:0, sda:1, vcc:2, gnd:3});
var x = await joystick.getXWait()
var y = await joystick.getYWait()
 
console.log("x:" + x + " y:" + y);
```