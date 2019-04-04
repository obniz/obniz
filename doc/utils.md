# Utils
Useful functions to use obniz from program are ready for use.

## reset()
This forces the obniz to go back to the initial state when the power was just turned on.

```Javascript
// Example
obniz = new Obniz("1234-5678");
obniz.onconnect = function() {
  obniz.reset();
}
```

## repeat(callback)
Repeat will call the callback function periodically while it is connected to obniz.
It will stop calling once it is disconnected from obniz.
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
This pauses obniz for a period given in terms of ms (millisecond).
```Javascript
// Javascript Example
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
```
This method pauses only obniz, not JavaScript.
```Javascript
// Javascript Example
var time = new Date();
led.on();
obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // 0 or very few ms. not 1000ms.
```
However, when you call this method together with the await function, JavaScript will pause for the given period in ms.
```Javascript
// Javascript Example
var time = new Date();
led.on();
await obniz.wait(1000); // led ON 1sec.
led.off();
console.log((new Date()).getTime() - time.getTime()) // => about 1000
```

## keepWorkingAtOffline(working)
By default, obniz resets after disconnection from the cloud.
It means the output value and pwm will all stop at that point.
But the above function with the argument true can nullify that default setting and change it to "do not reset when offline".
This configuration remains as long as obniz is on.
```Javascript
// Example
obniz.keepWorkingAtOffline(true);
```

## util.createCanvasContext(width, height);
This creates a Canvas context.
It will add a canvas dom to body(in html).

```Javascript
// Example
const ctx = obniz.util.createCanvasContext(128, 64);
ctx.font = "9px sans-serif";
ctx.fillText('Hello', 0, 7);
```