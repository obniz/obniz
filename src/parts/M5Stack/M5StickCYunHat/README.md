# M5StickC Yun Hat

M5StickC Yun Hat

![](image.jpg)

## wired(obniz,  {sda, scl, i2c} )

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
```

## [await] getTempWait()

Get a temperature. Unit is Celsius.

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var temp = await yun.getTempWait();
console.log('temperature:' + temp);
```

## [await] getHumidWait()

Get a Humidity. Unit is Ratio(%).

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var Humid = await yun.getHumidWait();
console.log('Humidity:' + Humid);
```

## [await] getPressureWait()

Get a Pressure. Unit is pressure(hPa).

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var Pressure = await yun.getPressureWait();
console.log('Pressure:' + Pressure);
```


## [await] getLightWait()

Get a Light level. 

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
var ligth = await yun.getLightWait();
console.log('ligth:' + ligth);
```

## [await] rgb(red,green,blue)

Specify the led color in RGB.range 0-255

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.rgb(255,0,0);//red
```

## [await] hsv(hue,saturation,value)

Specify the led color in HSV.

- hue : 0-300
- saturation : 0-1
- value : 0-1

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.hsv(100,0.5,0.2);
```

## [await] rgbs([[red,green,blue]])

Specify the led color in RGB.range 0-255

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.rgbs([[255,0,0],[0,255,0]]);
```

## [await] hsvs([[hue,saturation,value]])

Specify the led color in HSV.

- hue : 0-300
- saturation : 0-1
- value : 0-1

```javascript
// Javascript Example
var yun = obniz.wired("M5StickC_Yun", {sda:0, scl:26});
yun.hsvs([[100,0.5,0.2],[20,1,0.2]]);
```
