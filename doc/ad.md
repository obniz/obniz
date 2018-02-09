# Peripheral AD
Read analog voltage of io.
ad0(on io0) to ad11 are available.

ad is independent peripheral.
ad will work while IO is used for another function like io.output, io.input, pwm, etc.  

## start(callback)
start measuring voltage on ioX until end() called.
call callback function when voltage was changed.

```Javascript
// Example
// start a/d on IO0
obniz.ad0.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
```
You can start without callback function.
callback function can be set at anytime.

```Javascript
// Example
// start a/d on IO0
obniz.ad0.start();
obniz.ad0.onchange = function(voltage){
  console.log("changed to "+voltage+" v")
}
```

You can get voltage without callback.
The value will be stored ```value``` variable.

```Javascript
// Example
// start a/d on IO0
obniz.ad0.start();
while(true) {
  console.log("changed to "+obniz.ad0.value+" v")
  await obniz.wait(1); // 1msec wait
}
```
## [await] getWait()
measure voltage onece. and reutrn it's value.

```Javascript
// Example
// get voltage applied to io1 every seconds
var voltage = await obniz.ad0.getWait();
console.log("voltage = "+voltage+" v");
```
## end()
Stop measuring voltage on ioX.

```Javascript
// Example
obniz.ad0.start();
obniz.ad0.end();
```
## onchange
This is callback function when voltage of ioX changed.

```Javascript
// Example
obniz.ad0.start(); // start a/d at io0
obniz.ad0.onchange = function(voltage) {
  console.log("voltage = "+voltage);
}
```