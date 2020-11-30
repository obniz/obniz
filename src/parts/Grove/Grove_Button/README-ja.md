# Grove_Button

Groveコネクタで利用できるボタンです。押されたかどうかを検知できます。

![](image.jpg)

## wired(obniz,  { signal [, vcc, gnd, grove]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal ボタンの状態を示す端子(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(0 pin of Grove)
grove | `object` | no | &nbsp;  | 接続するデバイスにgroveがある場合に利用できます

```Javascript
// Javascript Example
var button = obniz.wired("Grove_Button", {gnd:0, vcc:1, signal: 3});
button.onchange = function(voltage) {
  console.log(voltage);
}
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```Javascript
// Javascript Example
var button = obniz.wired("Grove_Button", {grove: obniz.grove0});
button.onchange = function(voltage) {
  console.log(voltage);
}
``` 

## onchange = function(pressed){}

ボタンが押された時、離された時にcallback関数を呼び出します。

```Javascript
// Javascript Example
var button = obniz.wired("Grove_Button", {gnd:0, vcc:1, signal: 3});
button.onchange = function(pressed){
  console.log("pressed:" + pressed)
};
```

## [await] isPressedWait()

ボタンが押されているかを確認します。

```Javascript
// Javascript Example
var button = obniz.wired("Grove_Button", {gnd:0, vcc:1, signal: 3});
var pressed = await button.isPressedWait();
console.log("Pressed = " + pressed);
```


## [await] stateWait()

ボタンが押される／離されるまで待ちます

```Javascript
// Javascript Example
var button = obniz.wired("Grove_Button", {gnd:0, vcc:1, signal: 3});
await button.stateWait(true); 
console.log("button pushed!");
await button.stateWait(false); 
console.log("button released");
```
