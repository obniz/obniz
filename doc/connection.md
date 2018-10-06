# obniz connection

obniz class provide abstract of obniz hardware.
By providing obniz id and instantiate it, you can control obniz and connected parts without details of websocket api.

## basics

Instantiate obniz with obniz id.
In HTML, just include obniz.js in script tag then you can use Obniz class.
In nodejs, after install from npm

```javascript
var Obniz = require('obniz');
```
Get class like this.

Then instantiate obniz with id.
```javascript
var obniz = new Obniz('1234-5678');
```
If you want to use two or more obniz then
```javascript
var obnizA = new Obniz('1234-5678');
var obnizB = new Obniz('0000-0000');
```

After instantiate, obniz.js will try to connect obniz by using [obniz Websocket API](https://obniz.io/doc/about_obniz_api).
Connection was established, onconnect function will be called. onclose is called when disconnected.
By default, automatic connection is set to true. so obniz.js continue trying to connect after disconnection.

```javascript
var obniz = new Obniz('1234-5678');
obniz.onconnect = async function() {

}
obniz.onclose = async function() {

}
```

Like turning on/off io is available after connection. So, any operation must done after onconnect

```javascript
var obniz = new Obniz('1234-5678');
obniz.onconnect = async function() {
  obniz.io0.output(true);
}
```

obniz.js has instantiate options.

## new Obniz('obniz id', { options })

Instantiate obniz.
obniz id is string. '-' will be ignored. But numbers can't be accepted.

```javascript
new Obniz('1234-5678') // OK
new Obniz('12345678') // OK
new Obniz(12345678) // Can't accept
```

If you connect to obniz which has access_token. Then provide like this way

```javascript
new Obniz('1234-5678', {access_token: 'your token here'})
```

If obniz is is not correct, then connection never established. In nodejs it will show error.
In HTML, obniz.js show prompt. user can input correct obniz id to it.
It shows only when invalid format. If you specify obniz id which doesn't exist, then this never be showed.

![](images/obniz_prompt.png)

When id is correct, obniz.js will try to connect cloud api and onconnect will be called after established.

When obniz and the device obniz.js runnning are expected in same Network, obniz.js will try to establish Websocket connection to obniz directly. This is called "local connect". When local connect is avaiable almost commands throught it's connection. not cloud. But Connection to the cloud is never closed.
And local connect is closed when cloud connection was closed.

![](images/local_connect.png)

The timing of onconnect() called depends on availability of local connect.
obniz.js will little wait for establish of local connect.
See flows.

![](images/onconnect_flow.png)

Second parameter is option.
These are availabe.

name | type | default | description
--- | --- | --- | ---
binary | `boolean` | true | compressed format. not json. It set to false, then local_connect can't be used
local_connect | `boolean` | true | obniz.js try to connect locally after cloud api established if possible. true will be ignored when binary was set to false
debug_dom_id | `string` | 'obniz-debug' | In HTML, online status and debug info will be showed in DOM which has this id.
auto_connect | `boolean` | true | obniz.js automatically connect to cloud API after instantiate soon. falset to disable it. The interval of auto connect become longer.
access_token | `string` | null | If you specified access_token to your obniz. set it's key to this parameter.
reset_obniz_on_ws_disconnection | `boolean` | true | With 'true', obniz cloud will reset your obniz after websocket from obniz.js connection was closed.


## connect()
You can connect manually by calling this when auto_connect set to false.

```javascript
var obniz = new Obniz('1234-5678', { auto_connect: false });

obniz.connect();
obniz.onconnect = async function() {
  obniz.io0.output(true);
}
```

## close()
Close current connection.
You need to set auto_connect to false, Otherwise connection will be recoverd.

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
Waiting finish to connect to obniz.

```javascript
var obniz = new Obniz('1234-5678');

await obniz.connectWait();

obniz.io0.output(true);
obniz.close();


```

You can set timeout(sec) param.

```javascript
var obniz = new Obniz('1234-5678');

var connected = await obniz.connectWait({timeout:10});  //timeout 10sec

if(connected){
    obniz.io0.output(true);
    obniz.close();
}

```

If the param `auto_connect` is false, it try only once. 

```javascript
var obniz = new Obniz('1234-5678',{auto_connect: false});

var connected = await obniz.connectWait();  //try once

if(connected){
    obniz.io0.output(true);
    obniz.close();
}
```

## debugprint
This let obniz.js to show logs like communicated jsons and connections logs to console.log.

```javascript
var obniz = new Obniz('1234-5678');
obniz.debugprint = true
obniz.onconnect = async function() {
  obniz.io0.output(true);
}
```

## resetOnDisconnect(reset)

This let you set `reset_obniz_on_ws_disconnection` after connection established.
By default. obniz will reset when user disconnect web socket from obniz cloud.
It means output value and pwm are all stop at that time.
this function can set "do not reset when no one connected to obniz".
This configuration will consist until user web socket disconnected.
Set false to this function to keepworking without user web socket.

```Javascript
// Example
obniz.resetOnDisconnect(false);
```