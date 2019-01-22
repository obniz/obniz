# Peripheral AD
AD reads analog voltage applied on each io.
ad0(on io0) to ad11 are available.

Only the voltage change will be notified.

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
All 12ch ad can be used. It will not affect the sampling rate.
##### 30 samples/sec or slower
Maximum sampling rate depends on your network speed and on obniz firmware version.(with ver1.0.0, max is 30samples/sec)
##### 10bit - VDD calibrated
ad also monitors vdd of obniz itself(normally 5v). Each ad result will be calibrated. And ad accuracy is 10bit.

Calibration method is depend on firmware version.

Firmware version|calibration method
---|---
under 1.2|Always
1.2 or higher|Only Vdd is under 4.5v

##### ad can be started even io is used for io-output/uart/spi etc
ad converter is independent. It also works while IO is used for another function. 

![](./images/ad_0.png)

Example: even works with uart
```Javascript
obniz.uart0.start({tx:0, rx:1}) // works with uart
obniz.ad0.start(function(voltage){
  console.log(voltage)
});
```

## start(callback(voltage))
This starts measuring voltage on ioX until end() is called.
Callback function is called when voltage gets changed.

```Javascript
// Javascript Example
obniz.ad0.start(function(voltage){
  console.log("changed to "+voltage+" v")
});
```
You can start without the callback function.
The callback function can be set at anytime.

```Javascript
// Javascript Example
obniz.ad0.start();
obniz.ad0.onchange = function(voltage){
  console.log("changed to "+voltage+" v")
}
```

Get the voltage value without callback.
The value will be stored in the `value` variable.

Note: This property stores the last received value.
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
This measures the voltage just once and returns its value.
This function will pause until ad result arrives to your js.

```Javascript
// Javascript Example
obniz.io0.output(true)
var voltage = await obniz.ad0.getWait();
obniz.io0.output(false)
console.log(""+voltage+" should be closed to 5.00");
```
## end()
This stops measuring voltage on ioX.

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