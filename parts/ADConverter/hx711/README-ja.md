# HX711

24-bit ADC ロードセル用重さセンサ

![](./image.jpg)


## wired(obniz, {vcc, gnd, sck, dout})

SCKとDOUTをobniz Boardと接続してください。
VCCとGNDはオプションです。

```javascript
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
```

## [await]  getValueWait(times = 1)

オフセット、スケールで計算される値を取得します。
平均を使用する場合は、timesパラメータを設定します。

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## [await] zeroAdjustWait(times = 1)

現在の値を基準に計測を行い、offsetの設定を行います。

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
await sensor.zeroAdjustWait();
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## setOffset

offsetの設定を行います。

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.setOffset(7000);
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## setScale

scaleの設定を行います。

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.setScale(2280);
var value = await sensor.getValueWait(10); //10 times average
console.log('grams:' + value);
```

## powerDown
センサーの電源を切ります。

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.powerDown();
```

## powerUp
センサーの電源をいれます。

```javascript
// Javascript Example
var sensor = obniz.wired("hx711" , {gnd:0, dout:1, sck:2, vcc:3} );
sensor.powerUp();
```
