# M5StickC_ADC

The AD Converter for M5StickC. It reads the potential difference between + and -.

[https://m5stack.com/products/m5stickc-adc-hat-ads1100](https://m5stack.com/products/m5stickc-adc-hat-ads1100)

![](./image.jpg)

## wired(obniz, {[scl, sda, vcc, gnd, i2c]})
connect to the obniz Board.
When using M5StickC, You do not need to assign pins. 


```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADC");
while(true) {
  var vol = await adc.getVoltageWait();
  console.log(vol + " V");
  await obniz.wait(1);
}
```

 
When using other devices, assign vcc and gnd as appropriate pins.

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
scl | `number(obniz Board io)` | no |  &nbsp; | scl of I2C
sda | `number(obniz Board io)` | no | &nbsp;  | sda of I2C
i2c | `object` | no | &nbsp;  | obniz i2c object

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADC", {sda:0, scl:26});
while(true) {
  var vol = await adc.getVoltageWait();
  console.log(vol + " V");
  await obniz.wait(1);
}
```

## setGain(number)

Setting a gain. Choose from 1(default),2,4,8 times.

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADC", {sda:0, scl:26});
adc.setGain(1);
while(true) {
  var vol = await adc.getVoltageWait();
  console.log(vol + " V");
  await obniz.wait(1);
}
```


## [await] getVoltageWait()

get the potential difference(V).

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADC", {sda:0, scl:26});
while(true) {
  var vol = await adc.getVoltageWait();
  console.log(vol + " V");
  await obniz.wait(1);
}
```