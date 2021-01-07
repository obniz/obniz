# Grove_Buzzer

Grove 水位センサ [Grove Water Level Sensor](https://wiki.seeedstudio.com/Grove-Water-Level-Sensor/) から水位を取得します。

![](image.jpg)

## wired(scl, sda {, vcc, gnd, grove})

obniz Boardに水位センサを接続します。
次のように接続を行います。

| grove | cable | obniz |
|:--:|:--:|:--:|
| scl | - | scl |
| sda | - | sda |
| vcc | - | vcc |
| gnd | - | gnd |


```javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
```
  
groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { grove: obniz.grove0 });
```

## onchange = function(value)

水位の変化を値で受け取ります。
valueは水位がミリメーター(mm)で変化します。
  
```Javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
sensor.onchange = function(value) {
  console.log(value);  // 0 mm - 100 mm
}
```

## [await] getWait()

センサーから値を取得します。
戻り値は水位がミリメーター(mm)で返ってきます。

```javascript
// Javascript Example
var waterLevelSensor = obniz.wired("Grove_WaterLevelSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
var val = await waterLevelSensor.getWait(); // 0 mm - 100 mm
console.log(val);
```
