# M5StickC_JoyStick

X軸Y軸とプッシュスイッチをもつM5StickC用ジョイスティック(JoyStick HAT)です。  
I2C通信を利用します。  

## wired(obniz, {scl, sda, vcc, gnd})
obniz Boardと接続します。  
M5StickCと接続する場合は、G0をsdaに、G26をsclに指定してください。  
その他の場合には、vccは3V3に当たるピンを指定してください。  

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});
```


## [await] isPressedWait()
ボタンが押されているかどうかを一度だけ取得します。  

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});

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
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});

var x = await joystick.getXWait()
var y = await joystick.getYWait()
 
console.log("x:" + x + " y:" + y);
```