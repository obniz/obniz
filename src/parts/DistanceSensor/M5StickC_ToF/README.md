# M5StickC_ToF
The distance sensor for the M5StickC with built-in laser distance sensor VL53L0X.  

## wired(obniz, {scl, sda, gnd})
その他の場合は、3V3ピンに外部から3.3Vを給電するようにしてください。  
connect to the obniz Board.  
When using M5StickC, specify G0 pin as sda and G26 pin as scl.  
When using other devices, supply 3.3V externally to the 3V3 pin.

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF", {scl:26, sda:0});
```

## [await] getWait()
get the distance(mm) once.   

```javascript
// JavaScript Examples
var sensor = obniz.wired("M5StickC_ToF", {scl:26, sda:0});
var distance = await sensor.getWait();
console.log(distance);
```