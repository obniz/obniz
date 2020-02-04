# M5StickC_MCP4725

M5StickC用DAコンバータです。+と-の間に電位差を作り出します。  

## wired(obniz, {scl, sda, vcc, gnd})
obniz Boardと接続します。  
M5StickCと接続する場合は、G0をsdaに、G26をsclに指定してください。
その他の場合には，更にvccとgndを適切なピンに指定してください．  

```javascript
// JavaScript Examples
var dac = obniz.wired("M5StickC_MCP4725", {sda:0, scl:26});
```

## setVoltage(voltage)
指定した電位差を作り出します。  
0\~3300(mV)の間の値を指定してください。  

```javascript
// JavaScript Examples
var dac = obniz.wired("M5StickC_MCP4725", {sda:0, scl:26});
dac.setVoltage(1024);
```