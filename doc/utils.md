# Utils
Useful functions on obniz

## connection with access_key
Connect access controlled obniz

```Javascript
// Example
obniz = new Obniz("1234-5678", {access_token:"T7tnyWRIx_rxJv6xOsA2hBY3_zrr1AsRqfsy...."});
obniz.onconnect = function() {

}
```

## reset()
force set obniz the state same as power on.

```Javascript
// Example
obniz = new Obniz("1234-5678");
obniz.onconnect = function() {
  obniz.reset();
}
```

## repeat(callback)
repeat will call callback function periodically.
It stop calling when disconnected from obniz.
```Javascript
// Example
obniz.ad0.start();
obniz.repeat(function(){
  if (obniz.ad0.value > 2.5) {
    obniz.io0.output(true);
  } else {
    obniz.io0.output(false);
  }
})
```
## [await] wait(ms)
Pause obniz until givem msec passed.
```Javascript
// Example
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
```
This method pause only obniz, javascript nerver stopped
```Javascript
// Example
var time = new Date();
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // 0 or very few msec. not 1000msec.
```
But, when you call this method with await, javascript wait processing until given msec passed
```Javascript
// Example
var time = new Date();
led.on();
await obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // => about 1000
```

## keepWorkingAtOffline(working)
By default. obniz will reset after disconnect from cloud.
It measn output value and pwms are all stop at that time.
this function can set "do not reset when offline".
This configration will consist until obniz power down.
```Javascript
// Example
obniz.keepWorkingAtOffline(false);
```

## resetOnDisconnect(reset)
By default. obniz will reset when user disconnect websocket from obniz cloud.
It measn output value and pwms are all stop at that time.
this function can set "do not reset when no one connected to obniz".
This configration will consist until user websocket disconnected.
Set false to this function to keepworking without user websocket.
```Javascript
// Example
obniz.resetOnDisconnect(false);
```

## util.createCanvasContext(width, height);
create a Canvas context.
It will add a canvas dom to body(in html).

```Javascript
// Example
const ctx = obniz.util.createCanvasContext(128, 64);
ctx.font = "9px sans-serif";
ctx.fillText('Hello', 0, 7);
```

## debugprint
show logs or not inside of obniz.js. default is false.

```Javascript
// Example
obniz = new Obniz("1234-5678");
obniz.debugprint = true;
obniz.onconnect = function() {
  obniz.reset();
}
```