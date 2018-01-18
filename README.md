# obniz SDK for javascript

This is [obniz](https://obniz.io/) javascript SDK.

This document available on our site [Document](https://obniz.io/doc)

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
Connect obniz and use hardwares
```javascript
  const Obniz = require('obniz');

  var obniz = new Obniz("0000-0000");
  obniz.onconnect = async function () {
    obniz.display.print("hello!");
    
    var servo = obniz.wired("ServoMotor", 0, 1, 2);
    servo.angle(90);
  }
```

See more details on [Document](https://obniz.io/doc)

## Lisence

See [LICENSE.txt](./LICENSE.txt)
