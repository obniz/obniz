# M5StickC_JoyStick

X軸Y軸とプッシュスイッチをもつジョイスティックです。I2C通信を利用します。

![](./image.jpg)

## wired(obniz, {[scl, sda, vcc, gnd]})
obnizデバイスと接続します。  


もしM5StickCを使用している場合、ピン指定を省略することができます。

```javascript
var obniz = new Obniz.M5StickC("OBNIZ_ID_HERE");
obniz.onconnect = async function() {
  var joystick = obniz.wired("M5StickC_JoyStick");  // auto assign option params  on m5stickc
  while(true) {
    var x = await joystick.getXWait();
    var y = await joystick.getYWait();
    console.log(`${x}x${y}`);
    await obniz.wait(1);
  }
}
```


その他のデバイスの場合は、下記のように指定してください。  

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はvcc, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
gnd | `number(obniz Board io)` | no |  &nbsp; | モジュールの場合はgnd, 単体の場合はHに接続します。別の電源につないでいる場合は指定する必要はありません。
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclとなる端子です
sda | `number(obniz Board io)` | no | &nbsp;  | I2Cのsdaとなる端子です
i2c | `object` | no | &nbsp;  | obnizのi2cオブジェクトです

```javascript
var obniz = new Obniz.M5StickC("OBNIZ_ID_HERE");
obniz.onconnect = async function() {
  var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});
  while(true) {
    var x = await joystick.getXWait()
    var y = await joystick.getYWait()
    console.log(`${x}x${y}`);
    await obniz.wait(1);
  }
}
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

値は中央で0となり、-127~127の範囲となります。個体差などによりジョイスティックをすべて倒しても最大値まで届かないことがあります。

```javascript
// JavaScript Examples
var joystick = obniz.wired("M5StickC_JoyStick", {scl:26, sda:0});
while(true) {
  var x = await joystick.getXWait()
  var y = await joystick.getYWait()
  console.log(`${x}-${y}`);
  await obniz.wait(1);
}
```