# obniz.js: SDK for JavaScript

[![npm version](https://badge.fury.io/js/obniz.svg)](https://badge.fury.io/js/obniz)
![](https://img.shields.io/npm/dt/obniz.svg) [![Build Status](https://secure.travis-ci.org/obniz/obniz.png?branch=master)](http://travis-ci.org/obniz/obniz)


[obniz Board](https://obniz.io/ja/) や[obnizOS](https://obniz.io/ja/doc/obnizos)を[obniz api](https://obniz.io/ja/doc/obniz_api/about_obniz_api)を使いJavaScriptから操作するためのsdkです。

## 使い方

```html
<html>
<head>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="https://unpkg.com/obniz/obniz.js"></script>
</head>
<body>

<input id="text">
<button id="send">send</button>

<script>
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    // embed parts
    obniz.display.print("hello!");
    obniz.switch.onchange = function(state) {
      $('body').css({
        "background-color" : (state == "push") ? "#F00" : "#FFF"
        });
    }

    // parts library
    var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
    servo.angle(90);
    
    // peripherals
    var uart = obniz.getFreeUart();
    uart.start({tx: 5, rx: 6, baud:9600});  
    
    $('#send').click(function () {
      uart.send($("#text").val());
    });

    obniz.io7.drive("5v")
    obniz.io7.output(true)
    obniz.io8.pull("3v");
    obniz.io8.drive("open-drain");
    obniz.io8.output(false);
  }
</script>
</body>
</html>
```

## TypeScript

```typescript
import * as Obniz from 'obniz'

const obniz = new Obniz("0000-0000");
obniz.onconnect = async () => {

  obniz.display.print("hello!");
  obniz.switch.onchange = (state: string) => {
    console.log(state);
  }
  const servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
  servo.angle(90);
}
```

## インストール

### ブラウザ
次のscriptタグをhtmlに組み込むだけです
```html
  <script src="https://unpkg.com/obniz/obniz.js"></script>
```
### Nodejs
npmでインストールします。
```shell
  npm install obniz
```
そしてjsの中でrequireして下さい。
```javascript
  const Obniz = require('obniz');
```

## 接続
obniz Boardをobniz idを使ってインスタンス化します。
そして接続が完了した時に呼ばれる関数をセットします。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {

  }
```
接続完了後にobniz Boardやobniz Boardにつながれた部品を扱えます。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.display.print("hello!");
    obniz.switch.onchange = function(state) {
      if (state === "push") {
        obniz.display.print("Button Pressed");
      }
    }
  }
```
IOペリフェラルも利用可能です。詳しくはそれぞれのペリフェラルドキュメントを見てください。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.io0.drive("5v");
    obniz.io0.output(true)
    obniz.io1.pull("3v");
    obniz.io1.drive("open-drain");
    obniz.io1.output(true);
    obniz.io2.drive("3v");
    obniz.io2.output(true);

    obniz.ad3.start(function(voltage){
      console.log("changed to "+voltage+" v")
    });

    var pwm = obniz.getFreePwm();
    pwm.start({io: 4});
    pwm.freq(1000);
    pwm.duty(50);

    var uart = obniz.getFreeUart();
    uart.start({tx: 5, rx: 6, baud:9600});  
    uart.onreceive = function(data, text) {
      console.log(data);
    }
    uart.send("Hello");
  }
```

## パーツライブラリ
パーツライブラリはobniz.jsに含まれています。ドキュメントはこちらで

[obniz Parts Library](https://obniz.io/sdk/parts)

obniz Boardにつながれた部品をつかうにはpartsをonconnect関数の中でインスタンス化します。どんな関数があるかなども [obniz Parts Library](https://obniz.io/sdk/parts/) で確認できます。

例えば LED [https://obniz.io/sdk/parts/LED](https://obniz.io/sdk/parts/LED)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var led = obniz.wired("LED", {anode:0, cathode:1});
    led.blink();
  }
```

HC-SR40(distance measure) [https://obniz.io/sdk/parts/HC-SR04](https://obniz.io/sdk/parts/HC-SR04)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, trigger:2, vcc:3});
    hcsr04.unit("inch");
    hcsr04.measure(function( distance ){
      console.log("distance " + distance + " inch")
    })
  }
```

## Example: browser integrates hardware
HTML上のUIとハードウェアの連携も簡単です。
```html
<input id="slider" type="range"  min="0" max="180" />

<script src="https://unpkg.com/obniz/obniz.js"></script>
<script>
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
  $("#slider").on('input', function() {
    servo.angle($("#slider").val())
  });
}
</script>
```

## Example: integrate web services
DropboxやTwitterなどのwebサービスとの連携もとても簡単に行なえます。
```javascript
// save data from obniz to dropbox
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var dbx = new Dropbox({ accessToken: '<YOUR ACCESS TOKEN HERE>' });
  var button = obniz.wired("Button",  {signal:0, gnd:1});
  button.onchange = function(pressed){
    if (pressed) {
  　　dbx.filesUpload({path: '/obniz.txt', contents: "[Button Pressed]\n" + new Date(), mode: 'overwrite' });
    }
  };
}
```

## Example: integrate two or more obniz
web-obniz Boardだけでなくobniz Board-obniz Boardの連携も簡単に行なえます。  
obniz Boardにつながれたサーボモーターを別のobniz Boardにつながれたつまみから操作してみます。
```javascript
// control servomotor from potention meter which connected to another obniz.
var obnizA = new Obniz("0000-0000");
obnizA.onconnect = async function () {
  var obnizB = new Obniz("0000-0001");
  obnizB.onconnect = async function(){
    var meter = obnizA.wired("Potentiometer", {pin0:0, pin1:1, pin2:2});
    var servo = obnizB.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
    meter.onchange =function(position) {
      servo.angle(position * 180);
    }; 
  }
}
```