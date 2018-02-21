# obniz.js: sdk for javascript
Control obniz from javascript. browser/nodejs.

## install

### browser

Include index.js
```html
  <script src="https://obniz.io/sdk/obniz.js"></script>
```
### nodejs
Install obniz
```shell
  npm install obniz
```
and import it on js file.
```javascript
  const Obniz = require('obniz');
```

## connect
To use obniz, instantiate obniz with obniz id. and set onconnect callback function. It will be called when connected to obniz successfully.
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {

  }
```

You are able to use everything on obniz after connect.
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
and it's io peripherals too
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.io0.drive("5v");
    obniz.io0.output(true)
    obniz.io1.pull("3v");
    obniz.io1.drive("open-drain");
    obniz.io1.output(false);
    obniz.io2.drive("3v");
    obniz.io2.output(true);

    obniz.ad3.start(function(voltage){
      console.log("changed to "+voltage+" v")
    });

    var pwm = obniz.getFreePwm();
    pwm.start(4);
    pwm.freq(1000);
    pwm.duty(50);

    obniz.uart0.start(5, 6, 119200);
    obniz.uart0.onreceive = function(data, text) {
      console.log(data);
    }
    obniz.uart0.send("Hello");
  }
```

## Parts library
parts library is embed in obniz.js.
All parts and it's details can be seen at

[obniz Parts Library](https://obniz.io/sdk/parts/)

To use connected parts, instantiate parts in onconnect callback function. And use it. Function list is on also [obniz Parts Library](https://obniz.io/sdk/parts/).

For example, LED [https://obniz.io/sdk/parts/LED](https://obniz.io/sdk/parts/LED)
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
    var hcsr04 = obniz.wired("HC-SR04", {vcc:3, triger:2, echo:1, gnd:0});
    hcsr04.unit("inch");
    hcsr04.measure(function( distance ){
      console.log("distance " + distance + " inch")
    })
  }
```

## browser integrates hardware
Easy to integrate UI on html and hardware
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
Easy to integrate web servies like Dropbox, Twitter.
```javascript
// save data from obniz to dropbox
var obniz = new Obniz("0000-0000");
obniz.onconnect = async function () {
  var dbx = new Dropbox({ accessToken: '<YOUR ACCESS TOKEN HERE>' });
  var button = obniz.wired("Button",  {signal:0, gnd:1});
  button.onChange(function(pressed){
    if (pressed) {
  　　dbx.filesUpload({path: '/obniz.txt', contents: "[Button Pressed]\n" + new Date(), mode: 'overwrite' });
    }
  });
}
```

## integrate two or more obniz
Not only web to obniz. obniz to obniz is easy too.
```javascript
// control servomotor from potention meter which connected to another obniz.
var obnizA = new Obniz("0000-0000");
obnizA.onconnect = async function () {
  var obnizB = new Obniz("0000-0001");
  obnizB.onconnect = async function(){
    var meter = obnizA.wired("PotentionMeter", 0, 1, 2);
    var servo = obnizB.wired("ServoMotor", 0, 1, 2);
    meter.onChange(function(position) {
      servo.angle(position * 180);
    }); 
  }
}
```