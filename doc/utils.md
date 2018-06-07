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
// Javascript Example
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
Pause obniz until given ms passed.
```Javascript
// Javascript Example
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
```
This method pause only obniz, javascript never stopped
```Javascript
// Javascript Example
var time = new Date();
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // 0 or very few ms. not 1000ms.
```
But, when you call this method with await, javascript wait processing until given ms passed
```Javascript
// Javascript Example
var time = new Date();
led.on();
await obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // => about 1000
```

## keepWorkingAtOffline(working)
By default. obniz will reset after disconnect from cloud.
It means output value and pwm are all stop at that time.
this function with argument true can set "do not reset when offline".
This configuration will consist until obniz power down.
```Javascript
// Example
obniz.keepWorkingAtOffline(true);
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