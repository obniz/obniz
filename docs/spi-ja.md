# Peripherals SPI
General Purpose SPIです。spi0, spi1の２つが利用できます。

## obniz.getFreeSpi()
未使用のSPIを返します。
```javascript
var spi = obniz.getFreeSpi();
```
もし利用可能なものがなければErrorとなります。
```javascript
var spi0 = obniz.getFreeSpi();
var spi1 = obniz.getFreeSpi();
var spi2 = obniz.getFreeSpi(); // Error
```

## start({mode, clk, mosi, miso, frequency [, drive, pull, gnd]});

spiをスタートさせます。
modeは"master"のみに対応しています。

driveとpullは出力設定オプションです.
何も指定しなければ，drive:5v, pull:nullが設定されます．
出力設定についてはobniz.io.drive() と pull() 関数に詳細があります.


```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);

// drive and pull is optional
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000, drive: "5v", pull:null}); 
```
## [await] writeWait(data);

spiにデータを送信します。
spiは送信したデータの分だけ受信します。受信したデータは返り値として返ってきます。
最大1024byteです。

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```

## write(data);
SPIにデータを送信します。受信は行いません。
最大1024byteです。

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
obniz.spi0.write([0x12, 0x98]);
```

## end();
spiを終了します

```Javascript
// Javascript Example
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, frequency:1000000}); 
obniz.spi0.write([0x12, 0x98]);
obniz.spi0.end();
```