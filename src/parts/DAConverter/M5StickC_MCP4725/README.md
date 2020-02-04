# M5StickC_MCP4725
The DA Converter for M5StickC. It makes the potential difference between + and -.  

## wired(obniz, {scl, sda, vcc, gnd})

connect to the obniz Board.
When using M5StickC, assign G0 pin as sda and G26 pin as scl.  
When using other devices, assign vcc and gnd as appropriate pins.

```javascript
// JavaScript Examples
var dac = obniz.wired("M5StickC_MCP4725", {sda:0, scl:26});
```

## setVoltage(voltage)
make the potential difference.  
specify a value between 0 and 3300(mV). 

```javascript
// JavaScript Examples
var dac = obniz.wired("M5StickC_MCP4725", {sda:0, scl:26});
dac.setVoltage(1024);
```