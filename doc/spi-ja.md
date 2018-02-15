# Peripherals SPI
General Purpose SPIです。spi0, spi1の２つが利用できます。
最大通信速度は80Mhzです。

## start({mode, clk, io_mosi, io_miso, clock});

spiをスタートさせます。
modeは"master"のみに対応しています。

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```
## [await] writeWait(data);

spiにデータを送信します。
spiは送信したデータの分だけ受信します。受信したデータは返り値として返ってきます

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
var ret = await obniz.spi0.writeWait([0x12, 0x98]);
console.log("received: "+ret);
```

## write(data);
SPIにデータを送信します。受信は行いません。

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
obniz.spi0.write([0x12, 0x98]);
```

## end();
spiを終了します

```Javascript
// Example
// master mode, 1Mhz, CLK = 0, MOSI = 1, MISO = 2
obniz.spi0.start({mode:"master", clk :0, mosi:1, miso:2, clock:1000000}); 
obniz.spi0.write([0x12, 0x98]);
obniz.spi0.end();
```