# obniz.js: sdk for javascript

[![npm version](https://badge.fury.io/js/obniz.svg)](https://badge.fury.io/js/obniz)
[![Build Status](https://secure.travis-ci.org/obniz/obniz.png?branch=master)](http://travis-ci.org/obniz/obniz)


This is [obniz](https://obniz.io/) sdk for javascript.


## Documentation
You can find the React documentation on [the website](https://obniz.io/doc/sdk/doc/README).

## install

### Browser
include from unpkg.com
```html
  <script src="https://unpkg.com/obniz/obniz.js"></script>
```
### Nodejs
with npm do:
```shell
  npm install obniz
```
import it on your js like:
```javascript
  const Obniz = require('obniz');
```

## Example
We have several examples on [the website](https://obniz.io/doc/sdk/doc/README). Here is the first one to get you started:
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

See more details on [https://obniz.io/doc/sdk/doc/README](https://obniz.io/doc/sdk/doc/README)

## Lisence

See [LICENSE.txt](./LICENSE.txt)
