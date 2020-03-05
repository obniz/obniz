# MCP4725

The DA Converter. It makes the potential difference between + and -. 

[http://ww1.microchip.com/downloads/en/DeviceDoc/22039d.pdf](http://ww1.microchip.com/downloads/en/DeviceDoc/22039d.pdf)

## wired(obniz, {[scl, sda, vcc, gnd, i2c]})
connect to the obniz Board.

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
scl | `number(obniz Board io)` | no |  &nbsp; | scl of I2C
sda | `number(obniz Board io)` | no | &nbsp;  | sda of I2C
i2c | `object` | no | &nbsp;  | obniz i2c object

```javascript
// JavaScript Examples
var dac = obniz.wired("MCP4725", {sda:0, scl:26});
dac.setVoltage(1.5);
```

## setVCCVoltage(number)

Store applied VCC voltate. Default is 5v. It must be equal to vcc voltage of connected chip.

```javascript
// JavaScript Examples
var dac = obniz.wired("MCP4725", {sda:0, scl:26});
dac.setVCCVoltage(3.3);
dac.setVoltage(1.5);
```


## setVoltage(voltage)

make the potential difference.  
specify a value between 0 and 3.3(V). 

Use setVCCVoltage() before if vcc is different from 5.0v.

```javascript
// JavaScript Examples
var dac = obniz.wired("MCP4725", {sda:0, scl:26});
dac.setVoltage(1.5);
```