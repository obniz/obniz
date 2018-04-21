# Peripheral AD
AD read analog voltage applied on each io.
ad0(on io0) to ad11 are available.

Only voltage change will be notified.

```Javascript
// Javascript Example
obniz.ad0.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
obniz.ad1.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
```

#### Features
##### 12ch same time.
all 12ch ad can be started. It will no affect to sampling rate.
##### 30 samples/sec or slower
Maximum sapling rate is depends on your network speed and also depends on obniz firmware version.(with ver1.0.0 max 30samples/sec)
##### 10bit - VDD calibrated
ad also monitor vdd of obniz itself(normally 5v). Each ad result will be calibrated. And ad accuracy is 10bit.
##### ad can be started even io is used for io-output/uart/spi etc
ad converter is independent. It will work while IO is used for another function. 

![](./images/ad_0.png)

Example: even works with uart
```Javascript
obniz.uart0.start({tx:0, rx:1}) // works with uart
obniz.ad0.start(function(voltage){
  console.log(voltage)
});
```

## start(callback(voltage))
start measuring voltage on ioX until end() called.
call callback function when voltage was changed.

```Javascript
// Javascript Example
obniz.ad0.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
```
You can start without callback function.
callback function can be set at anytime.

```Javascript
// Javascript Example
obniz.ad0.start();
obniz.ad0.onchange = function(voltage){
  console.log("changed to "+voltage+" v")
}
```

Get voltage without callback.
The value will be stored ```value``` variable.

notice: This property stores last received value.
NOT the value when you read this property.

```Javascript
// Javascript Example
obniz.ad0.start();
while(true) {
  console.log("changed to "+obniz.ad0.value+" v")
  await obniz.wait(10); // 10ms wait
}
```
## [await] getWait()
Measure voltage once. and return it's value.
This function will pause until ad result arrive to your js.

```Javascript
// Javascript Example
obniz.io0.output(true)
var voltage = await obniz.ad0.getWait();
obniz.io0.output(false)
console.log(""+voltage+" should be closed to 5.00");
```
## end()
Stop measuring voltage on ioX.

```Javascript
// Javascript Example
obniz.ad0.start();
obniz.ad0.end();
```
## onchange = function(voltage)
Callback function can be set after start.

```Javascript
// Javascript Example
obniz.ad0.start();
obniz.ad0.onchange = function(voltage) {
  console.log("voltage = "+voltage);
}
```