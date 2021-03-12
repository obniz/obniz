# M5StickC_DAC

The DA Converter for M5StickC. It makes the potential difference between + and -. 

[https://m5stack.com/products/m5stickc-dac-hat-mcp4725](https://m5stack.com/products/m5stickc-dac-hat-mcp4725)

![](./image.jpg)

## wired(obniz, {[scl, sda, vcc, gnd, i2c]})
connect to the obniz Board.
When using M5StickC, You do not need to assign pins. 

```javascript
// JavaScript Examples
var dac = obniz.wired("M5StickC_DAC", {sda:0, scl:26});
dac.setVoltage(1.5);
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
var dac = obniz.wired("M5StickC_DAC", {sda:0, scl:26});
dac.setVoltage(1.5);
```


## setVoltage(voltage)

make the potential difference.  
specify a value between 0 and 3.3(V). 

```javascript
// JavaScript Examples
var dac = obniz.wired("M5StickC_DAC", {sda:0, scl:26});
dac.setVoltage(1.5);
```