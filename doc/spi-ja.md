# Peripherals SPI
General Purpose SPIです。spi0, spi1の２つが利用できます。
最大通信速度は80Mhzです。

## start(mode, io_clk, io_mosi, io_miso, frequency);

spiをスタートさせます。
modeは"master"のみに対応しています。

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start("master", 0, 1, 2, 1000000); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```
## [await] writeWait(data);

spiにデータを送信します。
spiは送信したデータの分だけ受信します。受信したデータは返り値として返ってきます

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start("master", 0, 1, 2, 1000000); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```

## write(data);
SPIにデータを送信します。受信は行いません。

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start("master", 0, 1, 2, 1000000); 
obniz.spi0.write([0x12, 0x98]);
```