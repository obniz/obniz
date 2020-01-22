# M5StickC Yun Hat

M5StickC Yun Hat

![](image.jpg)

## wired(obniz,  {sda, scl, i2c} )

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
```

## [await] getTempWait()

気温を取得します。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
var temp = await yun.getTempWait();
console.log('temperature:' + temp);
```

## [await] getHumidWait()

湿度を取得します。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
var Humid = await yun.getHumidWait();
console.log('Humidity:' + Humid);
```

## [await] getPressureWait()

気圧を取得します。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
var Pressure = await yun.getPressureWait();
console.log('Pressure:' + Pressure);
```


## [await] getLightWait()

明るさレベルを取得します。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
var ligth = await yun.getLightWait();
console.log('ligth:' + ligth);
```

## [await] rgb(red,green,blue)

LEDの色をRGBで指定します。
すべてのLEDが指定した色で光ります。

0-255の範囲で指定してください。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
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
var yun = obniz.wired("Yun", {sda:0, scl:26});
yun.hsv(100,0.5,0.2);
```

## [await] rgbs([[red,green,blue]])

LEDの色をRGBで指定します。
配列の順番通りにLEDの色を付けられます。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
yun.rgbs([[255,0,0],[0,255,0]]);
```

## [await] hsvs([[hue,saturation,value]])

LEDの色をHSVで指定します。
配列の順番通りにLEDの色を付けられます。

```javascript
// Javascript Example
var yun = obniz.wired("Yun", {sda:0, scl:26});
yun.hsvs([[100,0.5,0.2],[20,1,0.2]]);
```
