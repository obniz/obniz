# M5StickC_Yun

M5StickC Yun Hat

![](image.jpg)

## wired(obniz,  {sda, scl, i2c} )

connect to the obniz device.  
When using M5StickC, You do not need to assign pins. 

```javascript
// JavaScript Examples
var obniz = new Obniz.M5StickC("OBNIZ_ID_HERE");
obniz.onconnect = async function() {
  var yun = obniz.wired("M5StickC_Yun");
}
```

When using other devices, White, yellow, red and black wires correspond to scl, sda, vcc and gnd respectively.  

name | type | required | default | description
--- | --- | --- | --- | ---
vcc | `number(obniz Board io)` | no |  &nbsp; | Power Supply
gnd | `number(obniz Board io)` | no |  &nbsp; | Power Supply
scl | `number(obniz Board io)` | no |  &nbsp; | scl of I2C
sda | `number(obniz Board io)` | no | &nbsp;  | sda of I2C
i2c | `object` | no | &nbsp;  | obniz i2c object

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
