# M5StickC_ToF
レーザー測距センサVL53L0Xを内蔵するM5StickC用距離センサです。


## wired(obniz, {scl, sda, gnd})
M5StickCと接続する場合は、G0をsdaに、G26をsclに指定してください。  
その他の場合は、3V3ピンに外部から3.3Vを給電するようにしてください。  

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF", {scl:26, sda:0});
```

## [await] getWait()
距離(mm)を一度だけ取得します。

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```