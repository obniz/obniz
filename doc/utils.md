# Utils
Useful functions on obniz

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
Pause javascript processing until givem ms.
```Javascript
// Example
console.log("before");
await obniz.wait(1000);
console.log("after 1 second");
```
## freeze(ms)
obniz wait for ms.
Difference between wait() and freeze() is wait will wait on user size javascript but freeze will freeze obniz itself.
And freeze will return soon.

For example
```Javascript
console.log("before");
obniz.io0.output(true);
obniz.freeze(1000);
obniz.io0.output(false);
console.log("after 0 second");
```
"After 0 second" will be shown soon. Not 1000 msec after.
But obniz will output io0 1sec. Because it freeze 1000msec.

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