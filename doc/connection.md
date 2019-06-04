# obniz connection

obniz class is the abstract version of obniz hardware within JavaScript.
By providing obniz id and instantiating it, you can control obniz and the connected parts without the details of websocket api.

## Basics

Instantiate obniz with obniz id.
In HTML, just include obniz.js in the script tag and you can use obniz class.
In nodejs, after installing it from npm,

```javascript
var Obniz = require('obniz');
```
obtain the class like this.

Then instantiate obniz with the id.
```javascript
var obniz = new Obniz('1234-5678');
```
If you want to use two or more obniz, then write as below
```javascript
var obnizA = new Obniz('1234-5678');
var obnizB = new Obniz('0000-0000');
```

After instantiating, obniz.js will try to connect to obniz by using [obniz Websocket API](https://obniz.io/doc/about_obniz_api).
Once connection is established, onconnect function will be called. onclose will be called when disconnected.
Automatic connection occurs by default, so obniz.js continues to try to re-establish connection after disconnection.

```javascript
var obniz = new Obniz('1234-5678');
obniz.onconnect = async function() {

}
obniz.onclose = async function() {

}
```

Operations like turning on/off an io becomes possible only after connection is established, so any operations you want obniz to undertake must be written in onconnect

```javascript
var obniz = new Obniz('1234-5678');
obniz.onconnect = async function() {
  obniz.io0.output(true);
}
```

obniz.js has options for instantiation, so please see the function references below.

## new Obniz('obniz id', { options })

We will now instantiate obniz.
obniz id is a string. Hyphen '-' is optional, but with just the numbers they can't be accepted.

```javascript
new Obniz('1234-5678') // OK
new Obniz('12345678') // OK
new Obniz(12345678) // Can't accept
```

If you connect to obniz which has an access token, provide an option like this

```javascript
new Obniz('1234-5678', {access_token: 'your token here'})
```

If obniz id is incorrect, connection will never be established. In nodejs, an error occurs.
In HTML, obniz.js shows a prompt message. The user can put in a correct obniz id into it.
It shows up only when the format is invalid. If you specify obniz id which doesn't exist, this would never be shown.

![](images/obniz_prompt.png)

When id is correct, obniz.js will try to connect cloud api and onconnect will be called after connection is established.

When obniz and the device running obniz.js is expected to be in the same network, obniz.js will try to establish a direct Websocket connection to obniz. This is called "local connect". When local connect is avaiable, obniz can be controlled with almost all commands without having to go through the cloud. However, the connection to the cloud never gets disconnected even when using local connect.
But when cloud connection gets closed, the local connect also gets closed.

![](images/local_connect.png)

The timing onconnect() gets called depends on the availability of local connect.
obniz.js will wait a little to establish connection via local connect as much as possible.
See the flow below.

![](images/onconnect_flow.png)

The second parameter when instantiating obniz is an option.
In that option, the following settings are possible.

name | type | default | description
--- | --- | --- | ---
binary | `boolean` | true | compressed format. not json. It set to false, then local_connect can't be used
local_connect | `boolean` | true | obniz.js try to connect locally after cloud api established if possible. true will be ignored when binary was set to false
debug_dom_id | `string` | 'obniz-debug' | In HTML, online status and debug info will be showed in DOM which has this id.
auto_connect | `boolean` | true | obniz.js automatically connect to cloud API after instantiate soon. falset to disable it. The interval of auto connect become longer.
access_token | `string` | null | If you specified access_token to your obniz. set it's key to this parameter.
reset_obniz_on_ws_disconnection | `boolean` | true | With 'true', obniz cloud will reset your obniz after all websocket connection to an obniz was closed.


## connect()
You can connect to obniz manually by calling connect() when auto_connect is set to be false.

```javascript
var obniz = new Obniz('1234-5678', { auto_connect: false });

obniz.connect();
obniz.onconnect = async function() {
  obniz.io0.output(true);
}
```


## close()
This closes the current connection.
You need to set auto_connect to false. Otherwise the connection will be recovered.

```javascript
var obniz = new Obniz('1234-5678', {
  auto_connect: false,
  reset_obniz_on_ws_disconnection: false
  });

obniz.connect();
obniz.onconnect = async function() {
  obniz.io0.output(true);
  obniz.close();
}
```


## [await]connectWait({timeout})
With this you wait until the connection to obniz succeeds.

```javascript
var obniz = new Obniz('1234-5678');

await obniz.connectWait();

obniz.io0.output(true);
obniz.close();


```

You can set timeout(sec) param. False will be returned when connection is not established within a set timeframe.

```javascript
var obniz = new Obniz('1234-5678');

var connected = await obniz.connectWait({timeout:10});  //timeout 10sec

if(connected){
    obniz.io0.output(true);
    obniz.close();
}

```

If the param `auto_connect` is set as false, it will try to connect only once and, if unsuccessful, return false. 

```javascript
var obniz = new Obniz('1234-5678',{auto_connect: false});

var connected = await obniz.connectWait();  //try once

if(connected){
    obniz.io0.output(true);
    obniz.close();
}
```

## connectionState

This let you know connection state to your obniz as string value.

state | type
--- | ---
`'closed'` | not connected.
`'connecting'` | connecting 
`'connected'` | connection established
`'closing'` | closing connection.


```javascript
var obniz = new Obniz('1234-5678');
console.log(obniz.connectionState) // => === "connecting"
obniz.onconnect = async function() {
  console.log(obniz.connectionState) // => === "connected"
}
```

## debugprint
This lets obniz.js to show logs like communicated jsons and connection logs in console.log.

```javascript
var obniz = new Obniz('1234-5678');
obniz.debugprint = true
obniz.onconnect = async function() {
  obniz.io0.output(true);
}
```

## hw

This variable indicate connected hardware identifier of target device

```javascript
var obniz = new Obniz('1234-5678');
obniz.debugprint = true
obniz.onconnect = async function() {
  console.log(obniz.hw) // ex. "obnizb1"
}
```

## firmware_ver

This variable indicate installed firmware version of target device

```javascript
var obniz = new Obniz('1234-5678');
obniz.debugprint = true
obniz.onconnect = async function() {
  console.log(obniz.firmware_ver) // ex. "2.0.0"
}
```

## resetOnDisconnect(reset)

This lets you change the setting of `reset_obniz_on_ws_disconnection` after connection is established.
By default, obniz cloud resets target obniz when the all websocket to obniz cloud was closed.
It means the output value and pwm will all stop at that point.
With the above function, you can nullify these resetting activities.
This configuration will remain until target obniz gets disconnected.
Set this function to false to keep working without any of the websocket connections.

```Javascript
// Example
obniz.resetOnDisconnect(false);
```