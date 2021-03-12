# M5StickC_Yun

M5StickC と接続できる Yun Hat　です。
温度、湿度、明るさのセンサーやLEDが付いています。

![](image.jpg)

## wired(obniz,  {sda, scl, i2c} )

obnizデバイスと接続します。  
もしM5StickCを使用している場合、ピン指定を省略することができます。

```javascript
// JavaScript Examples
var yun = obniz.wired("M5StickC_Yun");
```

その他のデバイスの場合は、下記のように指定してください。  

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
scl | `number(obniz Board io)` | no |  &nbsp; | I2Cのsclとなる端子です
sda | `number(obniz Board io)` | no | &nbsp;  | I2Cのsdaとなる端子です
i2c | `object` | no | &nbsp;  | obnizのi2cオブジェクトです

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
```

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
```

## [await] getTempWait()

気温を取得します。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var temp = await yun.getTempWait();
console.log('temperature:' + temp);
```

## [await] getHumidWait()

湿度を取得します。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var Humid = await yun.getHumidWait();
console.log('Humidity:' + Humid);
```

## [await] getPressureWait()

気圧を取得します。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var Pressure = await yun.getPressureWait();
console.log('Pressure:' + Pressure);
```


## [await] getLightWait()

明るさレベルを取得します。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var ligth = await yun.getLightWait();
console.log('ligth:' + ligth);
```

## [await] rgb(red,green,blue)

LEDの色をRGBで指定します。
すべてのLEDが指定した色で光ります。

0-255の範囲で指定してください。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.rgb(255,0,0);//red
```

## [await] hsv(hue,saturation,value)

LEDの色をHSVで指定します。
すべてのLEDが指定した色で光ります。

- hue : 0-300
- saturation : 0-1
- value : 0-1

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.hsv(100,0.5,0.2);
```

## [await] rgbs([[red,green,blue]])

LEDの色をRGBで指定します。
配列の順番通りにLEDの色を付けられます。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.rgbs([[255,0,0],[0,255,0]]);
```

## [await] hsvs([[hue,saturation,value]])

LEDの色をHSVで指定します。
配列の順番通りにLEDの色を付けられます。

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.hsvs([[100,0.5,0.2],[20,1,0.2]]);
```
