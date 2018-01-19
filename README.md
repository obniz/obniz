# obniz.js: sdk for javascript

This is [obniz](https://obniz.io/) sdk for javascript.

This document available on our site [https://obniz.io/doc/obnizjs/doc/README](https://obniz.io/doc/obnizjs/doc/README)

## install

### on browser

Include index.js
```html
  <script src="//parts.obniz.io/obniz.js"></script>
```
### on nodejs
Install obniz
```shell
  npm install obniz
```
and import it on js file.
```javascript
  const Obniz = require('obniz');
```

## connect and use hardwares
To use obniz, instantiate obniz with obniz id. and set onconnect callback function. It will be called when connected to obniz successfully.
```javascript
  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.display.print("hello!");
    
    obniz.io.outputType("push-pull")
    obniz.io0.output(true)
    obniz.io1.pullup();
    obniz.io1.outputType("open-drain");
    obniz.io1.output(false);

    var servo = obniz.wired("ServoMotor", 2, 3, 4);
    servo.angle(90);
  }
```

See more details on [https://obniz.io/doc/obnizjs/doc/README](https://obniz.io/doc/obnizjs/doc/README)

## Lisence

See [LICENSE.txt](./LICENSE.txt)
