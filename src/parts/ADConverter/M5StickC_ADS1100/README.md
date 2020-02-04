# M5StickC_ADS1100

The AD Converter for M5StickC. It reads the potential difference between + and -.

## wired(obniz, {scl, sda, vcc, gnd})

connect to the obniz Board.
When using M5StickC, assign G0 pin as sda and G26 pin as scl.  
When using other devices, assign vcc and gnd as appropriate pins.

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADS1100", {sda:0, scl:26});
```

## [await] getVoltageWait()

get the potential difference(mV).

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADS1100", {sda:0, scl:26});
var vol = adc.getVoltageWait();
console.log(vol + " mV");
```