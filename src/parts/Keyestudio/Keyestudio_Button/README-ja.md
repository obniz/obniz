# Keyestudio_Button

Keyestudio社製ボタンモジュールです。押されたかどうかを検知できます。

![](image.jpg)

## wired(obniz,  {signal [, vcc, gnd]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | yes |  &nbsp; | signal ボタンの状態を示す端子(s pin of Keyestudio)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(+ pin of Keyestudio)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(- pin of Keyestudio)


```Javascript
// Javascript Example
var button = obniz.wired("Keyestudio_Button", {signal:0, vcc:1, gnd:2});
button.onchange = function(voltage) {
  console.log(voltage);
}
```

## onchange = function(pressed){}

ボタンが押された時、離された時にcallback関数を呼び出します。

```Javascript
// Javascript Example
var button = obniz.wired("Keyestudio_Button", {signal:0, vcc:1, gnd:2});
button.onchange = function(pressed){
  console.log("pressed:" + pressed)
};
```

## [await] isPressedWait()

ボタンが押されているかを確認します。

```Javascript
// Javascript Example
var button = obniz.wired("Keyestudio_Button", {signal:0, vcc:1, gnd:2});
var pressed = await button.isPressedWait();
console.log("Pressed = " + pressed);
```


## [await] stateWait()

ボタンが押される／離されるまで待ちます

```Javascript
// Javascript Example
var button = obniz.wired("Keyestudio_Button", {signal:0, vcc:1, gnd:2});
await button.stateWait(false); 
console.log("button pushed!");
await button.stateWait(true); 
console.log("button released");
```
