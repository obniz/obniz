# M5StickC_ADS1100

M5StickC用ADコンバータです。+と-の間の電位差を読み取ります。  

## wired(obniz, {scl, sda, vcc, gnd})
obniz Boardと接続します。  
M5StickCと接続する場合は、G0をsdaに、G26をsclに指定してください。
その他の場合には，更にvccとgndを適切なピンに指定してください．  

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADS1100", {sda:0, scl:26});
```

## [await] getVoltageWait()
読み取った電位差(mV)を取得します。  

```javascript
// JavaScript Examples
var adc = obniz.wired("M5StickC_ADS1100", {sda:0, scl:26});
var vol = adc.getVoltageWait();
console.log(vol + " mV");
```