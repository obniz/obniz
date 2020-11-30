# Temperature Sensor - SHT31
温度センサSHT31です。センサで取得した温度を知ることができます。

![](image.jpg)

## wired(obniz,  {vcc , sda, scl, adr, gnd, addressmode,　address} )
obniz Boardに温度センサをつなぎます。
0,1,2,3,4はそれぞれ温度センサのVCC,SDA,SCL,ADDR,GNDピンへ接続してください。
addressmodeはI2Cアドレスです。アドレスを0x44にする場合は4,0x45にする場合は5を入力してください。
ADDRピンをプルアップしている場合は0x45,プルダウンしている場合は0x44です。
秋月電子のモジュールキット(K-12125)を使用している場合のデフォルトは0x45です。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:4});
```

アドレス指定をする場合は次の通りです。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, gnd:4, address:0x44});
```

## [await] getTempWait()
現在の温度を計測して返します。単位は摂氏(°C)です。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var temp = await sensor.getTempWait();
console.log('temperature:' + temp);
```

## [await] getHumidWait()
現在の湿度を計測して返します。単位は%です。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var humd = await sensor.getHumidWait();
console.log('humidity:' + humd);
```

## [await] getAllWait()
現在の温度と湿度を計測して返します。

```javascript
// Javascript Example
var sensor = obniz.wired("SHT31", {vcc:0, sda:1, scl:2, adr:3, gnd:4, addressmode:5});
var data = await sensor.getAllWait();
console.log('humidity:' + data.temperature);
console.log('temperature:' + data.humidity);
```