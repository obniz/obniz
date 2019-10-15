# ST7735S based 80x160 TFT 

Library for M5StickC 80x160px display that's using a ST7735S controller. 
This is a port of the [SainSmartTFT18LCD](../SainSmartTFT18LCD/README.md) part that's using a ST7735R controller.
Functionality is basically the same with just some configuration adjustments.



## Usage

This library can also be used with just the display module and then we need to specify the pin connections


```javascript
lcd = obniz.wired("ST7735S", {'sclk': 0, 'mosi':1, 'cs':2, 'res':3, 'dc':4});
```


# Drawing API


## `witdh` and `height` property

You can retrive `witdh`and`height` from property.

```javascript
// Javascript Example
lcd = obniz.wired('SainSmartTFT18LCD', { scl:4, sda:3, dc:2, res:1, cs:0, vcc:6, gnd:5 });
console.log(lcd.width);  //128
console.log(lcd.height); //160 
```

## color16(r, g, b)

Get 16bit color pallet for specified rgb. Each r,g,b msut be in 0 to 255.
Result is 16bit format.
```
16bitRGB　=　Red(r)：upper 5bit、Green(g)：lower 6bit、Blue(b)： lower 5it
```

Or you can specify preset 16bit RGB color.

`pixel` for `raw()` and `rawBound()` is 24bit. But It down to 18bit RGB when drawing.


```javascript
// Javascript Example
let red = lcd.color16(255, 0, 0); //16bitRGB for red
lcd.drawRect(0, 0, lcd.width, lcd.height, red);
```

# Common arguments

|Argument|Description|
|:---|:--|
|x<br>y|`x`and`y` coordinate。|
|width<br>height| dimention of drawing|
|color|16bit color|
|radius|radius on drawing circle|
|round| corner radius|
|backgroundColor| background color for drawing `dwarChar()`, `drawString()`. If you specify same color as `color`, then background color is transparant|
|size| text size for `dwarChar()`, `drawString()`. 1-4. No smoothing.|
|||

# Drawing API

## fillScreen(color)

Fill whole screen with specified color.

## drawRect(x, y, width, height, color)<br>fillRect(x, y, width, height, color)

Draw a rectangle. Regarding `x`, `y`, `width`, `height` and `color`.
This draw only border. `fillRect()` will Fill a rectangle.

## drawRoundRect(x, y, width, height, round, color)<br>fillRoundRect(x, y, width, height, round, color)

Draw a rectangle with corner radius. Regarding `x`, `y`, `width`, `height` and `color` and `round`.
This draw only border. `fillRoundRect()` will Fill a rectangle.


## drawCircle(x, y, radius, color)<br>fillCircle(x, y, radius, color)
  
Draw a circle. Regarding `x`, `y` and `radius` and `color`.
`fillCircle()` will fill a circle.


## drawTriangle(x0, y0, x1, y1, x2, y2, color)<br>fillTriangle(x0, y0, x1, y1, x2, y2, color)
  
`drawTriangle()` will draw a triangle regarding three points `x0`, `y0`,`x1`, `y1`,`x2`, `y2` with `color`.
`fillTriangle()` will fill a triangle.


## drawVLine(x, y, height, color)<br>drawHLine(x, y, width, color)
  
`drawVLine()` will draw a vertical line `x`, `y` to `height`
`drawHLine()` will draw a horizonal line `x`, `y` to `width` with color.
Each function works faster than `drawLine()`.


## drawLine(x0, y0, x1, y1, color)
  
`drawLine()` will draw a line `x0`, `y0` to `x1`, `y1` with `color`.


```javascript
// Javascript Example

// 16bit-RGB color value
const BLACK   = 0x0000;
const BLUE    = 0x001F;
const RED     = 0xF800;
const GREEN   = 0x07E0;
const CYAN    = 0x07FF;
const MAGENTA = 0xF81F;
const YELLOW  = 0xFFE0;
const WHITE   = 0xFFFF;
lcd.fillScreen(BLACK);
lcd.drawRoundRect(0, 0, lcd.width, lcd.height, 8, RED);
lcd.fillRect(10, 10, lcd.width - 20, lcd.height - 20, MAGENTA);
await obniz.wait(1000);
lcd.drawRect(14, 14, lcd.width - 28, lcd.height - 28, GREEN);
lcd.fillRoundRect(20, 20, lcd.width - 40, lcd.height - 40, 4, CYAN);
await obniz.wait(1000);
lcd.drawCircle(0, 0, 100, BLACK);
lcd.fillCircle(64, 80, 40, YELLOW);
lcd.drawCircle(64, 80, 40, RED);
await obniz.wait(1000);
lcd.drawTriangle(64, 24, 24, lcd.height - 24, lcd.width - 24, lcd.height - 24, BLACK);
lcd.fillTriangle(64, lcd.height - 48, 24, 48, lcd.width - 24, 48, GREEN);
await obniz.wait(1000);
lcd.drawVLine(64, 10, lcd.height - 20, RED);
lcd.drawHLine(10, 80, lcd.width - 20, BLUE);
lcd.drawLine(10, 10, lcd.width - 10, lcd.height - 10, BLACK);
```


## drawChar(x, y, char, color, backgroundColor {, size })<br>drawString(x, y, string, color, backgroundColor {, size {, wrap }})
  
`drawChar()` draw ACII single character at`x`, `y` with `char` specified with `color` and `backgroundColor` and `size`. 

`drawString()` draw `string`.

`wrap=true` will automatically use new line when overflow.
And final coordinate wil be returnd.

```javascript
// Javascript Example
:  :
let white = lcd.color16(255, 255, 255);
let red = lcd.color16(255, 0, 0);
let yellow = lcd.color16(255, 255, 0);
lcd.drawChar(0, 0, '+', yellow, red, 4);
var x = 7, y = 32;
[x, y] = lcd.drawString(x, y, 'This is 1st draw.', white, white);
[x, y] = lcd.drawString(x, y, 'This is 2nd draw.', red, red, 2, true);
```

If you want to draw not ascii string. Use [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) and transfer by using `drawContextBound()` and `drawContext()`.


## drawContextBound(context, x0, y0, width, height, x1, y1)<br>drawContext(context)

`drawContextBound()` and `drawContext()` use `canvas.context(2D)` to draw a LCD.


![転送元/先の関係](./drawBound.png)


Specify `context` to `canvas.context` and region `x0`, `y0`, `width`, `height`.
And destination is `x1`, `y1`. 

`drawContext()`is equal to `drawContextBound(context, 0, 0, lcd.width, lcd.height, 0, 0)`.

Drawing speed depends on network. At minimum `drawContext()` takes around 300 msec.


```javascript
// Javascript
//<canvas id="canvas" width="128" height="160"></canvas>
let canvas = $('#canvas');
let context = canvas[0].getContext('2d');
context.fillStyle = '#FFFFCC';
context.fillRect(0, 0, lcd.width, lcd.height);
lcd.drawContext(context, false);
```

# Other APIs

## setRotation(dir)

Set LCD direction by specifing 0 to 3. Default is 0.
This function doesn't affect current display.

![](./rotate60.png)

After calling this, `witdh` and `height` will be updated. `x=0, y=0` points is like this image.

```javascript
// Javascript Example
:  :
lcd.fillScreen(0); //clear screen to black
for (let n = 0; n < 4; n++) {
  lcd.setRotation(n);
  lcd.drawChar(0, 0, n+'', 0xFFFF, 0xFFFF, 2);
  lcd.fillCircle(2, 2, 2, 0xF800); // plots origin point to red
}
```

## setInversionOn()<br>setInversionOff()<br>setInversion(inversion)

Invert a displayed color.

`setInversionOn()`: Invert

`setInversionOff()`: Not Invert

`setInversion(inversion)`: inversion=true is Invert.


## rawBound(x, y, width, height, [pixel0, pixel1, pixel2, ...])<br>raw([pixel0, pixel1, pixel2, ...])

`rawBound()` directly draw pixels.

Regions is `x`, `y`, `width`, `height`.

Pixels are `pixel0`, `pixel1`, `pixel2`, `...`. Each pixel is 24bit RGB color.

`raw()` is equal to `rawBound(0, 0, lcd.width, lcd.height, [pixel0, pixel1, pixel2, ...])`.

Each function will draw faster than `drawPixel()`. But it require more data transfer. Sigle calling of `raw()` takes 800 msec.

<font color="Red">Attention</font> `pixel[]` is 24bit RGB color. If you use 16bit color, then strange color you will see.

Single calling of `raw()` tansfer data is 60Kbyte( 128 x 160 x 3byte（18bitcolor) )


## Preset Color（16bitRGB）

Preset colors.
This color can be used for `color` on each function.

```javascript
// Javascript Example
lcd.drawLine(0, 0, lcd.width, lcd.height, lcd.color.AliceBlue);
```

| preset name  | red | green | blue | sample | 
|:-----|:-----|:-----|:-----|:-----:|
|AliceBlue|0x1e|0x3e|0x1f|<font color="AliceBlue">■</font>|
|AntiqueWhite|0x1f|0x3a|0x1a|<font color="AntiqueWhite">■</font>|
|Aqua|0x00|0x3f|0x1f|<font color="Aqua">■</font>|
|Aquamarine|0x0f|0x3f|0x1a|<font color="Aquamarine">■</font>|
|Azure|0x1e|0x3f|0x1f|<font color="Azure">■</font>|
|Beige|0x1e|0x3d|0x1b|<font color="Beige">■</font>|
|Bisque|0x1f|0x39|0x18|<font color="Bisque">■</font>|
|Black|0x00|0x00|0x00|<font color="Black">■</font>|
|BlanchedAlmond|0x1f|0x3a|0x19|<font color="BlanchedAlmond">■</font>|
|Blue|0x00|0x00|0x1f|<font color="Blue">■</font>|
|BlueViolet|0x11|0x0a|0x1c|<font color="BlueViolet">■</font>|
|Brown|0x14|0x0a|0x05|<font color="Brown">■</font>|
|BurlyWood|0x1b|0x2e|0x10|<font color="BurlyWood">■</font>|
|CadetBlue|0x0b|0x27|0x14|<font color="CadetBlue">■</font>|
|Chartreuse|0x0f|0x3f|0x00|<font color="Chartreuse">■</font>|
|Chocolate|0x1a|0x1a|0x03|<font color="Chocolate">■</font>|
|Coral|0x1f|0x1f|0x0a|<font color="Coral">■</font>|
|CornflowerBlue|0x0c|0x25|0x1d|<font color="CornflowerBlue">■</font>|
|Cornsilk|0x1f|0x3e|0x1b|<font color="Cornsilk">■</font>|
|Crimson|0x1b|0x05|0x07|<font color="Crimson">■</font>|
|Cyan|0x00|0x3f|0x1f|<font color="Cyan">■</font>|
|DarkBlue|0x00|0x00|0x11|<font color="DarkBlue">■</font>|
|DarkCyan|0x00|0x22|0x11|<font color="DarkCyan">■</font>|
|DarkGoldenRod|0x17|0x21|0x01|<font color="DarkGoldenRod">■</font>|
|DarkGray|0x15|0x2a|0x15|<font color="DarkGray">■</font>|
|DarkGreen|0x00|0x19|0x00|<font color="DarkGreen">■</font>|
|DarkKhaki|0x17|0x2d|0x0d|<font color="DarkKhaki">■</font>|
|DarkMagenta|0x11|0x00|0x11|<font color="DarkMagenta">■</font>|
|DarkOliveGreen|0x0a|0x1a|0x05|<font color="DarkOliveGreen">■</font>|
|DarkOrange|0x1f|0x23|0x00|<font color="DarkOrange">■</font>|
|DarkOrchid|0x13|0x0c|0x19|<font color="DarkOrchid">■</font>|
|DarkRed|0x11|0x00|0x00|<font color="DarkRed">■</font>|
|DarkSalmon|0x1d|0x25|0x0f|<font color="DarkSalmon">■</font>|
|DarkSeaGreen|0x11|0x2f|0x11|<font color="DarkSeaGreen">■</font>|
|DarkSlateBlue|0x09|0x0f|0x11|<font color="DarkSlateBlue">■</font>|
|DarkSlateGray|0x05|0x13|0x09|<font color="DarkSlateGray">■</font>|
|DarkTurquoise|0x00|0x33|0x1a|<font color="DarkTurquoise">■</font>|
|DarkViolet|0x12|0x00|0x1a|<font color="DarkViolet">■</font>|
|DeepPink|0x1f|0x05|0x12|<font color="DeepPink">■</font>|
|DeepSkyBlue|0x00|0x2f|0x1f|<font color="DeepSkyBlue">■</font>|
|DimGray|0x0d|0x1a|0x0d|<font color="DimGray">■</font>|
|DodgerBlue|0x03|0x24|0x1f|<font color="DodgerBlue">■</font>|
|FireBrick|0x16|0x08|0x04|<font color="FireBrick">■</font>|
|FloralWhite|0x1f|0x3e|0x1e|<font color="FloralWhite">■</font>|
|ForestGreen|0x04|0x22|0x04|<font color="ForestGreen">■</font>|
|Fuchsia|0x1f|0x00|0x1f|<font color="Fuchsia">■</font>|
|Gainsboro|0x1b|0x37|0x1b|<font color="Gainsboro">■</font>|
|GhostWhite|0x1f|0x3e|0x1f|<font color="GhostWhite">■</font>|
|Gold|0x1f|0x35|0x00|<font color="Gold">■</font>|
|GoldenRod|0x1b|0x29|0x04|<font color="GoldenRod">■</font>|
|Gray|0x10|0x20|0x10|<font color="Gray">■</font>|
|Green|0x00|0x20|0x00|<font color="Green">■</font>|
|GreenYellow|0x15|0x3f|0x05|<font color="GreenYellow">■</font>|
|HoneyDew|0x1e|0x3f|0x1e|<font color="HoneyDew">■</font>|
|HotPink|0x1f|0x1a|0x16|<font color="HotPink">■</font>|
|IndianRed|0x19|0x17|0x0b|<font color="IndianRed">■</font>|
|Indigo|0x09|0x00|0x10|<font color="Indigo">■</font>|
|Ivory|0x1f|0x3f|0x1e|<font color="Ivory">■</font>|
|Khaki|0x1e|0x39|0x11|<font color="Khaki">■</font>|
|Lavender|0x1c|0x39|0x1f|<font color="Lavender">■</font>|
|LavenderBlush|0x1f|0x3c|0x1e|<font color="LavenderBlush">■</font>|
|LawnGreen|0x0f|0x3f|0x00|<font color="LawnGreen">■</font>|
|LemonChiffon|0x1f|0x3e|0x19|<font color="LemonChiffon">■</font>|
|LightBlue|0x15|0x36|0x1c|<font color="LightBlue">■</font>|
|LightCoral|0x1e|0x20|0x10|<font color="LightCoral">■</font>|
|LightCyan|0x1c|0x3f|0x1f|<font color="LightCyan">■</font>|
|LightGoldenRodYellow|0x1f|0x3e|0x1a|<font color="LightGoldenRodYellow">■</font>|
|LightGray|0x1a|0x34|0x1a|<font color="LightGray">■</font>|
|LightGreen|0x12|0x3b|0x12|<font color="LightGreen">■</font>|
|LightPink|0x1f|0x2d|0x18|<font color="LightPink">■</font>|
|LightSalmon|0x1f|0x28|0x0f|<font color="LightSalmon">■</font>|
|LightSeaGreen|0x04|0x2c|0x15|<font color="LightSeaGreen">■</font>|
|LightSkyBlue|0x10|0x33|0x1f|<font color="LightSkyBlue">■</font>|
|LightSlateGray|0x0e|0x22|0x13|<font color="LightSlateGray">■</font>|
|LightSteelBlue|0x16|0x31|0x1b|<font color="LightSteelBlue">■</font>|
|LightYellow|0x1f|0x3f|0x1c|<font color="LightYellow">■</font>|
|Lime|0x00|0x3f|0x00|<font color="Lime">■</font>|
|LimeGreen|0x06|0x33|0x06|<font color="LimeGreen">■</font>|
|Linen|0x1f|0x3c|0x1c|<font color="Linen">■</font>|
|Magenta|0x1f|0x00|0x1f|<font color="Magenta">■</font>|
|Maroon|0x10|0x00|0x00|<font color="Maroon">■</font>|
|MediumAquaMarine|0x0c|0x33|0x15|<font color="MediumAquaMarine">■</font>|
|MediumBlue|0x00|0x00|0x19|<font color="MediumBlue">■</font>|
|MediumOrchid|0x17|0x15|0x1a|<font color="MediumOrchid">■</font>|
|MediumPurple|0x12|0x1c|0x1b|<font color="MediumPurple">■</font>|
|MediumSeaGreen|0x07|0x2c|0x0e|<font color="MediumSeaGreen">■</font>|
|MediumSlateBlue|0x0f|0x1a|0x1d|<font color="MediumSlateBlue">■</font>|
|MediumSpringGreen|0x00|0x3e|0x13|<font color="MediumSpringGreen">■</font>|
|MediumTurquoise|0x09|0x34|0x19|<font color="MediumTurquoise">■</font>|
|MediumVioletRed|0x18|0x05|0x10|<font color="MediumVioletRed">■</font>|
|MidnightBlue|0x03|0x06|0x0e|<font color="MidnightBlue">■</font>|
|MintCream|0x1e|0x3f|0x1f|<font color="MintCream">■</font>|
|MistyRose|0x1f|0x39|0x1c|<font color="MistyRose">■</font>|
|Moccasin|0x1f|0x39|0x16|<font color="Moccasin">■</font>|
|NavajoWhite|0x1f|0x37|0x15|<font color="NavajoWhite">■</font>|
|Navy|0x00|0x00|0x10|<font color="Navy">■</font>|
|OldLace|0x1f|0x3d|0x1c|<font color="OldLace">■</font>|
|Olive|0x10|0x20|0x00|<font color="Olive">■</font>|
|OliveDrab|0x0d|0x23|0x04|<font color="OliveDrab">■</font>|
|Orange|0x1f|0x29|0x00|<font color="Orange">■</font>|
|OrangeRed|0x1f|0x11|0x00|<font color="OrangeRed">■</font>|
|Orchid|0x1b|0x1c|0x1a|<font color="Orchid">■</font>|
|PaleGoldenRod|0x1d|0x3a|0x15|<font color="PaleGoldenRod">■</font>|
|PaleGreen|0x13|0x3e|0x13|<font color="PaleGreen">■</font>|
|PaleTurquoise|0x15|0x3b|0x1d|<font color="PaleTurquoise">■</font>|
|PaleVioletRed|0x1b|0x1c|0x12|<font color="PaleVioletRed">■</font>|
|PapayaWhip|0x1f|0x3b|0x1a|<font color="PapayaWhip">■</font>|
|PeachPuff|0x1f|0x36|0x17|<font color="PeachPuff">■</font>|
|Peru|0x19|0x21|0x07|<font color="Peru">■</font>|
|Pink|0x1f|0x30|0x19|<font color="Pink">■</font>|
|Plum|0x1b|0x28|0x1b|<font color="Plum">■</font>|
|PowderBlue|0x16|0x38|0x1c|<font color="PowderBlue">■</font>|
|Purple|0x10|0x00|0x10|<font color="Purple">■</font>|
|RebeccaPurple|0x0c|0x0c|0x13|<font color="RebeccaPurple">■</font>|
|Red|0x1f|0x00|0x00|<font color="Red">■</font>|
|RosyBrown|0x17|0x23|0x11|<font color="RosyBrown">■</font>|
|RoyalBlue|0x08|0x1a|0x1c|<font color="RoyalBlue">■</font>|
|SaddleBrown|0x11|0x11|0x02|<font color="SaddleBrown">■</font>|
|Salmon|0x1f|0x20|0x0e|<font color="Salmon">■</font>|
|SandyBrown|0x1e|0x29|0x0c|<font color="SandyBrown">■</font>|
|SeaGreen|0x05|0x22|0x0a|<font color="SeaGreen">■</font>|
|SeaShell|0x1f|0x3d|0x1d|<font color="SeaShell">■</font>|
|Sienna|0x14|0x14|0x05|<font color="Sienna">■</font>|
|Silver|0x18|0x30|0x18|<font color="Silver">■</font>|
|SkyBlue|0x10|0x33|0x1d|<font color="SkyBlue">■</font>|
|SlateBlue|0x0d|0x16|0x19|<font color="SlateBlue">■</font>|
|SlateGray|0x0e|0x20|0x12|<font color="SlateGray">■</font>|
|Snow|0x1f|0x3e|0x1f|<font color="Snow">■</font>|
|SpringGreen|0x00|0x3f|0x0f|<font color="SpringGreen">■</font>|
|SteelBlue|0x08|0x20|0x16|<font color="SteelBlue">■</font>|
|Tan|0x1a|0x2d|0x11|<font color="Tan">■</font>|
|Teal|0x00|0x20|0x10|<font color="Teal">■</font>|
|Thistle|0x1b|0x2f|0x1b|<font color="Thistle">■</font>|
|Tomato|0x1f|0x18|0x08|<font color="Tomato">■</font>|
|Turquoise|0x08|0x38|0x1a|<font color="Turquoise">■</font>|
|Violet|0x1d|0x20|0x1d|<font color="Violet">■</font>|
|Wheat|0x1e|0x37|0x16|<font color="Wheat">■</font>|
|White|0x1f|0x3f|0x1f|<font color="White">■</font>|
|WhiteSmoke|0x1e|0x3d|0x1e|<font color="WhiteSmoke">■</font>|
|Yellow|0x1f|0x3f|0x00|<font color="Yellow">■</font>|
|YellowGreen|0x13|0x33|0x06|<font color="YellowGreen">■</font>|