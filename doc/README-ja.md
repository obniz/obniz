# obniz.js sdk for javascript
obnizをbrowser/nodejsのjavascriptから。

## install

### browser

index.jsを読み込みます。
```html
  <script src="https://obniz.io/sdk/obniz.js"></script>
```
### nodejs
Install obniz
```shell
  npm install obniz
```
そしてjsの中でimportして下さい。
```javascript
  const Obniz = require('obniz');
```

## connect
obnizをobniz idを使ってインスタンス化します。
そして接続が完了した時に呼ばれる関数をセットします。
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {

  }
```
接続完了後にobnizやobnizにつながれた部品を扱えます。
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
    pwm.start(4);
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

## Parts library
パーツライブラリはobniz.jsに含まれています。ドキュメントはこちらで

[obniz Parts Library](https://obniz.io/sdk/parts)

obnizにつながれた部品をつかうにはpartsをonconnect関数の中でインスタンス化します。どんな関数があるかなども [obniz Parts Library](https://obniz.io/sdk/parts/) で確認できます。

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
    var hcsr04 = obniz.wired("HC-SR04", {gnd:0, echo:1, triger:2, vcc:3});
    hcsr04.unit("inch");
    hcsr04.measure(function( distance ){
      console.log("distance " + distance + " inch")
    })
  }
```

## browser integrates hardware
HTML上のUIとハードウェアの連携も簡単です。
```html
<input id="slider" type="range"  min="0" max="180" />

<script src="https://obniz.io/sdk/obniz.js"></script>
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

## integrate web services
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

## integrate two or more obniz
web-obnizだけでなくobniz-obnizの連携も簡単に行なえます。  
obnizにつながれたサーボモーターを別のobnizにつながれたつまみから操作してみます。
```javascript
// control servomotor from potention meter which connected to another obniz.
var obnizA = new Obniz("0000-0000");
obnizA.onconnect = async function () {
  var obnizB = new Obniz("0000-0001");
  obnizB.onconnect = async function(){
    var meter = obnizA.wired("PotentionMeter", {pin0:0, pin1:1, pin2:2});
    var servo = obnizB.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
    meter.onchange =function(position) {
      servo.angle(position * 180);
    }; 
  }
}
```