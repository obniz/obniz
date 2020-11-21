# obniz.js: SDK for JavaScript

[![npm version](https://badge.fury.io/js/obniz.svg)](https://badge.fury.io/js/obniz)
![](https://img.shields.io/npm/dt/obniz.svg) [![Build Status](https://secure.travis-ci.org/obniz/obniz.png?branch=master)](http://travis-ci.org/obniz/obniz)

SDK for controlling [obniz enabled Devices](https://obniz.com/) using obniz websocket API from JavaScript.

It works on both browser and nodejs.

Docs

- [Guides](https://docs.obniz.com/guides/)
- [Class References](https://obniz.github.io/obniz/obnizjs/index.html)

Related Sites

- [obniz WebSite](https://obniz.com/)
- [obniz Devices](https://obniz.com/products)
- [Examples](https://blog.obniz.com/example/)

Examples in obniz.js

- [Examples](./examples)


## Usage
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

    obniz.com7.drive("5v")
    obniz.com7.output(true)
    obniz.com8.pull("3v");
    obniz.com8.drive("open-drain");
    obniz.com8.output(false);
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

## Installation

### Browser
Add the following script tag to your html
```html
  <script src="https://unpkg.com/obniz/obniz.js"></script>
```
### Nodejs
Install obniz via npm
```shell
  npm install obniz
```
and import it to js file.
```javascript
  const Obniz = require('obniz');
```

## Connect

The details are on [doc/connection](docs/connection.md) ([ja](docs/connection-ja.md))

To use obniz, instantiate obniz with obniz id, and set onconnect callback function. It will be called when connected to obniz successfully.
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {

  }
```

You can use everything on obniz Board once connection succeeds.
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
and its io peripherals too can be used
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.com0.drive("5v");
    obniz.com0.output(true)
    obniz.com1.pull("3v");
    obniz.com1.drive("open-drain");
    obniz.com1.output(false);
    obniz.com2.drive("3v");
    obniz.com2.output(true);

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

## Parts library
The parts library is embedded in obniz.js.
All parts and their details can be found there.

[obniz Parts Library](https://obniz.com/sdk/parts/)

To use the connected parts, instantiate the parts in onconnect callback function and use it. The function list can be found on [obniz Parts Library](https://obniz.com/sdk/parts/).

For example, LED is found here [https://obniz.com/sdk/parts/LED](https://obniz.com/sdk/parts/LED)
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    var led = obniz.wired("LED", {anode:0, cathode:1});
    led.blink();
  }
```

HC-SR40(distance measure) [https://obniz.com/sdk/parts/HC-SR04](https://obniz.com/sdk/parts/HC-SR04)
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
It is easy to integrate UI and hardware on html
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
It is also easy to integrate web services like Dropbox and Twitter and hardware.
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
Not only is web-obniz Board coordination easy, but obniz Board-obniz Board coordination is also easy.
```javascript
// control servomotor from potention meter which connected to another obniz.
var obnizA = new Obniz("0000-0000");
obnizA.onconnect = async function () {
  var obnizB = new Obniz("0000-0001");
  obnizB.onconnect = async function(){
    var meter = obnizA.wired("Potentiometer", 0, 1, 2);
    var servo = obnizB.wired("ServoMotor", 0, 1, 2);
    meter.onchange = function(position) {
      servo.angle(position * 180);
    }; 
  }
}
```


## Lisence
See [LICENSE.txt](./LICENSE.txt)

## Contribute

[Contribution](./devtools/docs/README.md)