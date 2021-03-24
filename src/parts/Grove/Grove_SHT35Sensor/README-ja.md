# Grove - I2C High Accuracy Temp&Humi Sensor(SHT35)

Grove I2C高精度温度および湿度センサー（SHT35）につなぐライブラリです。

[Grove I2C High Accuracy Temp&Humi Sensor(SHT35)](https://wiki.seeedstudio.com/Grove-I2C_High_Accuracy_Temp&Humi_Sensor-SHT35/).

![](image.jpg)

## wired(scl, sda {, vcc, gnd, grove})

obniz BoardにGrove I2C高精度温度および湿度センサー（SHT35）を接続します。
次のように接続を行います。

| grove | cable | obniz |
|:--:|:--:|:--:|
| scl | - | scl |
| sda | - | sda |
| vcc | - | vcc |
| gnd | - | gnd |

```javascript
// Javascript Example
var Grove_SHT35Sensor = obniz.wired("Grove_SHT35Sensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
```

groveを持つデバイスでは、パラメータに{grove: obniz.grove0}を指定することで接続できます。
```javascript
// Javascript Example
var Grove_SHT35Sensor = obniz.wired("Grove_SHT35Sensor", { grove: obniz.grove0 });
```

## [await] getAllWait()

すべての値を取得します。

- temperature: セルシウス温度
- humidity: %

```javascript
// Javascript Example
var Grove_SHT35Sensor = obniz.wired("Grove_SHT35Sensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
const datas = await Grove_SHT35Sensor.getAllWait();
console.log('temp: ' + datas.temperature + ' degree');
console.log('humidity: ' + datas.humidity + ' %');
```
